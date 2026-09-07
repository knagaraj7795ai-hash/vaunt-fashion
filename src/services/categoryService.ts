import rawCategories from '../data/categories.json';
import rawBrands from '../data/brands.json';
import rawBanners from '../data/banners.json';
import { Category, Brand, Banner } from '../types/category';

const categories: Category[] = rawCategories as Category[];
const brands: Brand[] = rawBrands as Brand[];
const banners: Banner[] = rawBanners as Banner[];

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    return Promise.resolve([...categories]);
  },

  async getCategoryById(id: string): Promise<Category | null> {
    const found = categories.find((c) => c.id === id);
    return Promise.resolve(found ? { ...found } : null);
  },

  async getBrands(): Promise<Brand[]> {
    return Promise.resolve([...brands]);
  },

  async getFeaturedBrands(): Promise<Brand[]> {
    return Promise.resolve(brands.filter((b) => b.isFeatured));
  },

  async getBrandById(id: string): Promise<Brand | null> {
    const found = brands.find((b) => b.id === id);
    return Promise.resolve(found ? { ...found } : null);
  },

  async getBanners(): Promise<Banner[]> {
    return Promise.resolve([...banners]);
  },
};
