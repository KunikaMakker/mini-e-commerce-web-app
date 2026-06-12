import { Product, ProductVariants, VariantStock } from "../types";

export function getBrandForCategory(category: string, id: number): string {
  const brands: { [cat: string]: string[] } = {
    "electronics": ["OmniTech", "VoltCore", "Helix Labs", "Aether"],
    "jewelery": ["Aura Atelier", "Vesperia Fine Jewelry", "Lucid Ornaments"],
    "men's clothing": ["Kinetix Apparel", "Vanguard Men", "Outpost Goods", "Nordic Thread"],
    "women's clothing": ["Maison Silhouette", "Ethereal Wear", "Solstice Studio", "La Rose"],
  };

  const choice = brands[category] || ["Studio Essentials", "Foundry Goods"];
  return choice[id % choice.length];
}

export function getOriginalPrice(id: number, currentPrice: number): number | undefined {
  // 40% of products are on sale
  if ((id * 3) % 10 < 4) {
    // Original price is 20% to 35% higher
    const markupPercentage = 1.2 + ((id % 4) * 0.05);
    return parseFloat((currentPrice * markupPercentage).toFixed(2));
  }
  return undefined;
}

export const COLOR_SWATCH_MAP: { [colorName: string]: string } = {
  "Midnight Black": "#121212",
  "Oatmeal Heather": "#DFD7CA",
  "Forest Green": "#2B3E34",
  "Slate Blue": "#4E667E",
  "Dusty Pink": "#D5A6A6",
  "Crimson Rose": "#8C2D19", 
  "Crimson": "#8C2919",
  "Warm Sand": "#D2B48C",
  "Matte Charcoal": "#2A2E33",
  "Brushed Silver": "#D1D5DB",
  "Champagne Gold": "#F1E5AC",
  "Rose Gold": "linear-gradient(135deg, #ECC2C2 0%, #DF9D9D 100%)",
  "Sterling Platinum": "#EBF4F6",
  "Aether White": "#F9FAFB",
};

export function getProductVariants(id: number, category: string): ProductVariants {
  let colors: string[] = ["Midnight Black", "Aether White"];
  let sizes: string[] = ["S", "M", "L", "XL"];

  if (category === "women's clothing") {
    colors = ["Midnight Black", "Dusty Pink", "Forest Green", "Oatmeal Heather"];
    sizes = ["XS", "S", "M", "L", "XL"];
  } else if (category === "men's clothing") {
    colors = ["Midnight Black", "Slate Blue", "Forest Green", "Oatmeal Heather"];
    sizes = ["S", "M", "L", "XL", "XXL"];
  } else if (category === "jewelery") {
    colors = ["Champagne Gold", "Rose Gold", "Brushed Silver"];
    sizes = ["6", "7", "8", "9"]; // Ring sizes, or standard jewelry sizing
  } else if (category === "electronics") {
    colors = ["Matte Charcoal", "Brushed Silver", "Midnight Black"];
    sizes = ["128GB", "256GB", "512GB"]; // Digital sizes as "sizes" show custom variant selection
  }

  // Build swatches
  const swatches: { [color: string]: string } = {};
  colors.forEach((color) => {
    swatches[color] = COLOR_SWATCH_MAP[color] || "#CCCCCC";
  });

  const stockCombinations: VariantStock[] = [];
  colors.forEach((color, colorIdx) => {
    sizes.forEach((size, sizeIdx) => {
      // Deterministic pseudo-random stock between 0 and 12
      // Use different constants to distribute sold-out, low stock, and available states
      const key = id * 11 + colorIdx * 17 + sizeIdx * 29;
      let stock = key % 13;

      // To ensure some varieties are guaranteed sold out (0) or low stock (1-2)
      if (stock === 11 || stock === 12) {
        stock = 0; // Sold out
      } else if (stock === 5 || stock === 6) {
        stock = Math.max(1, id % 3); // Selling fast
      } else {
        stock = Math.max(3, (key % 8) + 3);
      }

      stockCombinations.push({ color, size, stock });
    });
  });

  return { colors, sizes, swatches, stockCombinations };
}

export function enrichProduct(apiProduct: any): Product {
  const brand = getBrandForCategory(apiProduct.category, apiProduct.id);
  const originalPrice = getOriginalPrice(apiProduct.id, apiProduct.price);
  return {
    ...apiProduct,
    brand,
    originalPrice,
  };
}

export function getProductImages(id: number, category: string, primaryImage: string): string[] {
  const categoryImages: { [cat: string]: string[] } = {
    "women's clothing": [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540221397713-98014eae414b?auto=format&fit=crop&w=800&q=80"
    ],
    "men's clothing": [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=800&q=80"
    ],
    "jewelery": [
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80"
    ],
    "electronics": [
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80"
    ]
  };

  const choice = categoryImages[category] || [
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80"
  ];

  // We rotate index based on id to provide variety across products
  const selected1 = choice[id % choice.length];
  const selected2 = choice[(id + 1) % choice.length];

  return [primaryImage, selected1, selected2];
}
