export interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  tags?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface UserPreferences {
  favoriteCategories: string[];
  priceRange: {
    min: number;
    max: number;
  };
}
