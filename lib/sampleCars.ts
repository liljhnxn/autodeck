import { PublishFormData } from "./types";

export const SAMPLE_CARS: Array<{ label: string; data: PublishFormData }> = [
  {
    label: "Porsche 911 GT3 RS",
    data: {
      name: "Porsche 911 GT3 RS (992)",
      brand: "Porsche",
      model: "911 GT3 RS",
      year: 2024,
      description: "Naturally aspirated 4.0-liter flat-six engine revving to 9,000 RPM. Active aerodynamics with DRS wing, magnesium wheels, and Weissach Package.",
      price: "0.28",
      location: "Stuttgart, Germany",
      imageUrl: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80",
      category: "Sports",
    },
  },
  {
    label: "Lamborghini Urus Performante",
    data: {
      name: "Lamborghini Urus Performante",
      brand: "Lamborghini",
      model: "Urus Performante",
      year: 2023,
      description: "Twin-turbo 4.0-liter V8 outputting 666 hp. Carbon-fiber bonnet and roof, titanium exhaust, rally mode, and track-honed dynamics.",
      price: "0.32",
      location: "Sant'Agata Bolognese, Italy",
      imageUrl: "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1200&q=80",
      category: "SUV",
    },
  },
  {
    label: "Rolls-Royce Ghost Black Badge",
    data: {
      name: "Rolls-Royce Ghost Black Badge",
      brand: "Rolls-Royce",
      model: "Ghost Black Badge",
      year: 2024,
      description: "6.75-liter twin-turbo V12 producing 591 hp. Bespoke Starlight headliner, illuminated Pantheon grille, and effortless Planar suspension.",
      price: "0.45",
      location: "London, United Kingdom",
      imageUrl: "https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&w=1200&q=80",
      category: "Luxury",
    },
  },
  {
    label: "Porsche Taycan Turbo S",
    data: {
      name: "Porsche Taycan Turbo S",
      brand: "Porsche",
      model: "Taycan Turbo S",
      year: 2024,
      description: "Electric beast delivering up to 750 hp on launch control. 0-60 mph in 2.6 seconds with an 800-volt high performance architecture.",
      price: "0.22",
      location: "Zürich, Switzerland",
      imageUrl: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80",
      category: "Electric",
    },
  },
  {
    label: "Ferrari Roma Spider",
    data: {
      name: "Ferrari Roma Spider",
      brand: "Ferrari",
      model: "Roma Spider",
      year: 2024,
      description: "Front-mid engine 3.9-liter turbo V8 pumping 612 hp. Timeless Italian grand touring elegance with a bespoke 5-layer fabric soft-top.",
      price: "0.35",
      location: "Maranello, Italy",
      imageUrl: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80",
      category: "Coupe",
    },
  },
  {
    label: "Mercedes-AMG GT 63 S E-Performance",
    data: {
      name: "Mercedes-AMG GT 63 S 4-Door",
      brand: "Mercedes-Benz",
      model: "AMG GT 63 S",
      year: 2023,
      description: "Handcrafted 4.0L V8 Biturbo with Formula 1 hybrid technology generating 831 hp and 1,033 lb-ft torque. Fully active air suspension.",
      price: "0.26",
      location: "Affalterbach, Germany",
      imageUrl: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80",
      category: "Sedan",
    },
  },
];

