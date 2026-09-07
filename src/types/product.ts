export type Gender = 'men' | 'women' | 'kids' | 'unisex';
export type Fit = 'Slim' | 'Regular' | 'Relaxed' | 'Oversized' | 'Tailored';
export type Occasion = 'Casual' | 'Formal' | 'Party' | 'Festive' | 'Sports' | 'Work';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface RatingDistribution {
  stars: number;
  count: number;
  percentage: number;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
  sizeBought?: string;
}

export interface Product {
  id: string;
  brandId: string;
  brandName: string;
  categoryId: string;
  subCategoryId: string;
  name: string;
  tagline?: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number; // in percentage, e.g. 40 for 40%
  rating: number;
  reviewCount: number;
  images: string[];
  colors: ProductColor[];
  sizes: string[];
  inStockSizes: string[];
  material: string;
  fit: Fit;
  occasion: Occasion;
  gender: Gender;
  specifications: ProductSpecification[];
  careInstructions: string[];
  tags: string[];
  isNew: boolean;
  isBestSeller: boolean;
  isTrending: boolean;
  isDealOfTheDay?: boolean;
  stock: number;
  available: boolean;
  deliveryDays: number;
  returnWindowDays: number;
}

export interface FilterState {
  categoryIds: string[];
  subCategoryIds: string[];
  brandIds: string[];
  genders: Gender[];
  sizes: string[];
  colors: string[];
  priceRange: [number, number];
  minRating: number;
  minDiscount: number;
  fits: Fit[];
  occasions: Occasion[];
  onlyInStock: boolean;
}

export type SortOption =
  | 'recommended'
  | 'newest'
  | 'price_low_high'
  | 'price_high_low'
  | 'rating'
  | 'discount';
