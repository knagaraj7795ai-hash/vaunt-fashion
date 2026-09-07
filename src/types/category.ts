export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  itemCount: number;
  imageUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  imageUrl: string;
  subCategories: SubCategory[];
  isFeatured?: boolean;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  tagline: string;
  rating: number;
  productCount: number;
  isFeatured: boolean;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  discountText: string;
  imageUrl: string;
  categoryId?: string;
  subCategoryId?: string;
  tagFilter?: string;
  backgroundColor?: string;
}
