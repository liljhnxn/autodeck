// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AutoDeck
 * @dev Decentralized car-discovery platform smart contract.
 * Allows users to publish car listings, like/unlike them, browse vehicles,
 * and manage their own listings on-chain.
 */
contract AutoDeck {
    struct CarListing {
        uint256 id;
        address author;
        string name;
        string brand;
        string model;
        uint16 year;
        string description;
        uint256 price; // in wei
        string location;
        string imageUrl;
        string category;
        uint256 likesCount;
        uint256 createdAt;
        bool isActive;
    }

    uint256 private _listingIdCounter;
    uint256 public activeListingsCount;
    uint256 public totalLikes;

    mapping(uint256 => CarListing) private _listings;
    mapping(uint256 => mapping(address => bool)) private _hasLiked;

    // Events
    event CarPublished(
        uint256 indexed id,
        address indexed author,
        string name,
        string brand,
        string category,
        uint256 price,
        uint256 createdAt
    );

    event CarLiked(
        uint256 indexed id,
        address indexed user,
        uint256 newLikesCount
    );

    event CarUnliked(
        uint256 indexed id,
        address indexed user,
        uint256 newLikesCount
    );

    event CarRemoved(
        uint256 indexed id,
        address indexed author,
        uint256 removedAt
    );

    // Custom Errors
    error InvalidInput(string field);
    error ListingNotFound(uint256 id);
    error ListingNotActive(uint256 id);
    error NotListingAuthor(uint256 id, address caller);
    error AlreadyLiked(uint256 id, address user);
    error NotLikedYet(uint256 id, address user);

    constructor() {}

    /**
     * @dev Validates category against allowed car categories
     */
    function isValidCategory(string memory cat) public pure returns (bool) {
        bytes32 h = keccak256(bytes(cat));
        return (
            h == keccak256(bytes("SUV")) ||
            h == keccak256(bytes("Sedan")) ||
            h == keccak256(bytes("Coupe")) ||
            h == keccak256(bytes("Sports")) ||
            h == keccak256(bytes("Luxury")) ||
            h == keccak256(bytes("Electric"))
        );
    }

    /**
     * @notice Publish a new car listing on-chain
     */
    function publishListing(
        string calldata name,
        string calldata brand,
        string calldata model,
        uint16 year,
        string calldata description,
        uint256 price,
        string calldata location,
        string calldata imageUrl,
        string calldata category
    ) external returns (uint256) {
        if (bytes(name).length == 0 || bytes(name).length > 100) revert InvalidInput("name");
        if (bytes(brand).length == 0 || bytes(brand).length > 50) revert InvalidInput("brand");
        if (bytes(model).length == 0 || bytes(model).length > 50) revert InvalidInput("model");
        if (year < 1886 || year > 2100) revert InvalidInput("year");
        if (bytes(description).length == 0 || bytes(description).length > 2000) revert InvalidInput("description");
        if (bytes(location).length == 0 || bytes(location).length > 100) revert InvalidInput("location");
        if (bytes(imageUrl).length == 0 || bytes(imageUrl).length > 1000) revert InvalidInput("imageUrl");
        if (!isValidCategory(category)) revert InvalidInput("category");

        _listingIdCounter++;
        uint256 newId = _listingIdCounter;

        _listings[newId] = CarListing({
            id: newId,
            author: msg.sender,
            name: name,
            brand: brand,
            model: model,
            year: year,
            description: description,
            price: price,
            location: location,
            imageUrl: imageUrl,
            category: category,
            likesCount: 0,
            createdAt: block.timestamp,
            isActive: true
        });

        activeListingsCount++;

        emit CarPublished(
            newId,
            msg.sender,
            name,
            brand,
            category,
            price,
            block.timestamp
        );

        return newId;
    }

    /**
     * @notice Like a car listing
     * @param id The ID of the car listing
     */
    function likeCar(uint256 id) external {
        if (id == 0 || id > _listingIdCounter) revert ListingNotFound(id);
        CarListing storage listing = _listings[id];
        if (!listing.isActive) revert ListingNotActive(id);
        if (_hasLiked[id][msg.sender]) revert AlreadyLiked(id, msg.sender);

        _hasLiked[id][msg.sender] = true;
        listing.likesCount++;
        totalLikes++;

        emit CarLiked(id, msg.sender, listing.likesCount);
    }

    /**
     * @notice Unlike a car listing
     * @param id The ID of the car listing
     */
    function unlikeCar(uint256 id) external {
        if (id == 0 || id > _listingIdCounter) revert ListingNotFound(id);
        CarListing storage listing = _listings[id];
        if (!listing.isActive) revert ListingNotActive(id);
        if (!_hasLiked[id][msg.sender]) revert NotLikedYet(id, msg.sender);

        _hasLiked[id][msg.sender] = false;
        listing.likesCount--;
        if (totalLikes > 0) {
            totalLikes--;
        }

        emit CarUnliked(id, msg.sender, listing.likesCount);
    }

    /**
     * @notice Remove a car listing. Only the original author can remove it.
     * @param id The ID of the car listing
     */
    function removeListing(uint256 id) external {
        if (id == 0 || id > _listingIdCounter) revert ListingNotFound(id);
        CarListing storage listing = _listings[id];
        if (!listing.isActive) revert ListingNotActive(id);
        if (listing.author != msg.sender) revert NotListingAuthor(id, msg.sender);

        listing.isActive = false;
        if (activeListingsCount > 0) {
            activeListingsCount--;
        }
        if (totalLikes >= listing.likesCount) {
            totalLikes -= listing.likesCount;
        } else {
            totalLikes = 0;
        }

        emit CarRemoved(id, msg.sender, block.timestamp);
    }

    /**
     * @notice Retrieve a single car listing by ID
     */
    function getListing(uint256 id) external view returns (CarListing memory) {
        if (id == 0 || id > _listingIdCounter) revert ListingNotFound(id);
        return _listings[id];
    }

    /**
     * @notice Check whether a user has liked a car listing
     */
    function hasUserLiked(uint256 id, address user) external view returns (bool) {
        return _hasLiked[id][user];
    }

    /**
     * @notice Batch check likes for multiple car listings
     */
    function hasUserLikedBatch(uint256[] calldata ids, address user) external view returns (bool[] memory) {
        bool[] memory results = new bool[](ids.length);
        for (uint256 i = 0; i < ids.length; i++) {
            results[i] = _hasLiked[ids[i]][user];
        }
        return results;
    }

    /**
     * @notice Retrieve all active car listings
     */
    function getAllListings() external view returns (CarListing[] memory) {
        uint256 count = activeListingsCount;
        CarListing[] memory activeItems = new CarListing[](count);
        uint256 currentIndex = 0;

        for (uint256 i = 1; i <= _listingIdCounter; i++) {
            if (_listings[i].isActive) {
                activeItems[currentIndex] = _listings[i];
                currentIndex++;
                if (currentIndex == count) break;
            }
        }

        return activeItems;
    }

    /**
     * @notice Retrieve active listings for a specific author
     */
    function getListingsByAuthor(address author) external view returns (CarListing[] memory) {
        uint256 authorCount = 0;
        for (uint256 i = 1; i <= _listingIdCounter; i++) {
            if (_listings[i].isActive && _listings[i].author == author) {
                authorCount++;
            }
        }

        CarListing[] memory authorItems = new CarListing[](authorCount);
        uint256 currentIndex = 0;
        for (uint256 i = 1; i <= _listingIdCounter; i++) {
            if (_listings[i].isActive && _listings[i].author == author) {
                authorItems[currentIndex] = _listings[i];
                currentIndex++;
            }
        }

        return authorItems;
    }

    /**
     * @notice Total listings ever created
     */
    function totalListingsCount() external view returns (uint256) {
        return _listingIdCounter;
    }

    /**
     * @notice Retrieve key platform stats
     */
    function getStats() external view returns (
        uint256 totalCars,
        uint256 totalLikesCount,
        uint256 totalEverPublished
    ) {
        return (activeListingsCount, totalLikes, _listingIdCounter);
    }
}

