export interface ProductRating {
  rate: number;
  count: number;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: ProductRating;
  // Computed or supplementary fields
  brand: string;
  originalPrice?: number;
}

export interface VariantStock {
  color: string;
  size: string;
  stock: number; // calculated stock quantity
}

export interface ProductVariants {
  colors: string[];
  sizes: string[];
  swatches: { [color: string]: string }; // color name to hex/css color code
  stockCombinations: VariantStock[];
}

export interface CartItem {
  id: string; // unique item id: e.g. `productId-color-size`
  productId: number;
  title: string;
  image: string;
  price: number;
  color: string;
  size: string;
  quantity: number;
  stockLimit: number;
}

export interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "id">) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartTotal: number;
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
}
