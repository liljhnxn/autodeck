const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AutoDeck Smart Contract", function () {
  let AutoDeck;
  let autoDeck;
  let owner;
  let user1;
  let user2;

  const validCar = {
    name: "Porsche 911 GT3 RS",
    brand: "Porsche",
    model: "911 GT3 RS",
    year: 2024,
    description: "Naturally aspirated 4.0-liter flat-six engine producing 518 hp.",
    price: ethers.parseEther("0.25"), // 0.25 ETH / BHR
    location: "Stuttgart, Germany",
    imageUrl: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e",
    category: "Sports",
  };

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    AutoDeck = await ethers.getContractFactory("AutoDeck");
    autoDeck = await AutoDeck.deploy();
    await autoDeck.waitForDeployment();
  });

  describe("Deployment", function () {
    it("should initialize with 0 active listings and 0 likes", async function () {
      expect(await autoDeck.activeListingsCount()).to.equal(0);
      expect(await autoDeck.totalLikes()).to.equal(0);
      expect(await autoDeck.totalListingsCount()).to.equal(0);
    });
  });

  describe("Publishing Listings", function () {
    it("should allow a user to publish a valid car listing", async function () {
      const tx = await autoDeck.connect(owner).publishListing(
        validCar.name,
        validCar.brand,
        validCar.model,
        validCar.year,
        validCar.description,
        validCar.price,
        validCar.location,
        validCar.imageUrl,
        validCar.category
      );

      await expect(tx)
        .to.emit(autoDeck, "CarPublished")
        .withArgs(
          1,
          owner.address,
          validCar.name,
          validCar.brand,
          validCar.category,
          validCar.price,
          (await ethers.provider.getBlock("latest")).timestamp
        );

      expect(await autoDeck.activeListingsCount()).to.equal(1);
      expect(await autoDeck.totalListingsCount()).to.equal(1);

      const listing = await autoDeck.getListing(1);
      expect(listing.id).to.equal(1);
      expect(listing.author).to.equal(owner.address);
      expect(listing.name).to.equal(validCar.name);
      expect(listing.brand).to.equal(validCar.brand);
      expect(listing.model).to.equal(validCar.model);
      expect(listing.year).to.equal(validCar.year);
      expect(listing.price).to.equal(validCar.price);
      expect(listing.location).to.equal(validCar.location);
      expect(listing.imageUrl).to.equal(validCar.imageUrl);
      expect(listing.category).to.equal(validCar.category);
      expect(listing.likesCount).to.equal(0);
      expect(listing.isActive).to.be.true;
    });

    it("should reject listings with invalid inputs", async function () {
      // Empty name
      await expect(
        autoDeck.publishListing("", "Porsche", "911", 2024, "Desc", 100, "Munich", "url", "Sports")
      ).to.be.revertedWithCustomError(autoDeck, "InvalidInput").withArgs("name");

      // Invalid year < 1886
      await expect(
        autoDeck.publishListing("Car", "Porsche", "911", 1800, "Desc", 100, "Munich", "url", "Sports")
      ).to.be.revertedWithCustomError(autoDeck, "InvalidInput").withArgs("year");

      // Invalid category
      await expect(
        autoDeck.publishListing("Car", "Porsche", "911", 2024, "Desc", 100, "Munich", "url", "Helicopter")
      ).to.be.revertedWithCustomError(autoDeck, "InvalidInput").withArgs("category");
    });
  });

  describe("Liking and Unliking", function () {
    beforeEach(async function () {
      await autoDeck.connect(owner).publishListing(
        validCar.name,
        validCar.brand,
        validCar.model,
        validCar.year,
        validCar.description,
        validCar.price,
        validCar.location,
        validCar.imageUrl,
        validCar.category
      );
    });

    it("should allow users to like a car listing", async function () {
      await expect(autoDeck.connect(user1).likeCar(1))
        .to.emit(autoDeck, "CarLiked")
        .withArgs(1, user1.address, 1);

      const listing = await autoDeck.getListing(1);
      expect(listing.likesCount).to.equal(1);
      expect(await autoDeck.totalLikes()).to.equal(1);
      expect(await autoDeck.hasUserLiked(1, user1.address)).to.be.true;
    });

    it("should prevent duplicate likes from the same wallet", async function () {
      await autoDeck.connect(user1).likeCar(1);
      await expect(autoDeck.connect(user1).likeCar(1))
        .to.be.revertedWithCustomError(autoDeck, "AlreadyLiked")
        .withArgs(1, user1.address);
    });

    it("should allow multiple users to like", async function () {
      await autoDeck.connect(user1).likeCar(1);
      await autoDeck.connect(user2).likeCar(1);

      const listing = await autoDeck.getListing(1);
      expect(listing.likesCount).to.equal(2);
      expect(await autoDeck.totalLikes()).to.equal(2);

      const batchLikes = await autoDeck.hasUserLikedBatch([1], user2.address);
      expect(batchLikes[0]).to.be.true;
    });

    it("should allow a user to unlike a car listing", async function () {
      await autoDeck.connect(user1).likeCar(1);
      await expect(autoDeck.connect(user1).unlikeCar(1))
        .to.emit(autoDeck, "CarUnliked")
        .withArgs(1, user1.address, 0);

      const listing = await autoDeck.getListing(1);
      expect(listing.likesCount).to.equal(0);
      expect(await autoDeck.totalLikes()).to.equal(0);
      expect(await autoDeck.hasUserLiked(1, user1.address)).to.be.false;
    });

    it("should revert when unliking a car not yet liked", async function () {
      await expect(autoDeck.connect(user1).unlikeCar(1))
        .to.be.revertedWithCustomError(autoDeck, "NotLikedYet")
        .withArgs(1, user1.address);
    });
  });

  describe("Removing Listings", function () {
    beforeEach(async function () {
      await autoDeck.connect(owner).publishListing(
        validCar.name,
        validCar.brand,
        validCar.model,
        validCar.year,
        validCar.description,
        validCar.price,
        validCar.location,
        validCar.imageUrl,
        validCar.category
      );
      await autoDeck.connect(user1).likeCar(1);
    });

    it("should allow the author to remove their listing", async function () {
      await expect(autoDeck.connect(owner).removeListing(1))
        .to.emit(autoDeck, "CarRemoved");

      const listing = await autoDeck.getListing(1);
      expect(listing.isActive).to.be.false;
      expect(await autoDeck.activeListingsCount()).to.equal(0);
      expect(await autoDeck.totalLikes()).to.equal(0);

      const all = await autoDeck.getAllListings();
      expect(all.length).to.equal(0);
    });

    it("should prevent non-authors from removing a listing", async function () {
      await expect(autoDeck.connect(user1).removeListing(1))
        .to.be.revertedWithCustomError(autoDeck, "NotListingAuthor")
        .withArgs(1, user1.address);
    });

    it("should not allow liking a removed listing", async function () {
      await autoDeck.connect(owner).removeListing(1);
      await expect(autoDeck.connect(user2).likeCar(1))
        .to.be.revertedWithCustomError(autoDeck, "ListingNotActive")
        .withArgs(1);
    });
  });

  describe("Queries & Platform Stats", function () {
    it("should return listings filtered by author and platform stats", async function () {
      await autoDeck.connect(owner).publishListing(
        "Car A", "Brand A", "Model A", 2023, "Desc A", 100, "NY", "urlA", "Sedan"
      );
      await autoDeck.connect(user1).publishListing(
        "Car B", "Brand B", "Model B", 2022, "Desc B", 200, "LA", "urlB", "SUV"
      );

      const ownerCars = await autoDeck.getListingsByAuthor(owner.address);
      expect(ownerCars.length).to.equal(1);
      expect(ownerCars[0].name).to.equal("Car A");

      const user1Cars = await autoDeck.getListingsByAuthor(user1.address);
      expect(user1Cars.length).to.equal(1);
      expect(user1Cars[0].name).to.equal("Car B");

      const stats = await autoDeck.getStats();
      expect(stats.totalCars).to.equal(2);
      expect(stats.totalLikesCount).to.equal(0);
      expect(stats.totalEverPublished).to.equal(2);
    });
  });
});

