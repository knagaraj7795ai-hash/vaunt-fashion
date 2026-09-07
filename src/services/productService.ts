import rawProducts from '../data/products.json';
import rawReviews from '../data/reviews.json';
import { Product, FilterState, SortOption, Review } from '../types/product';

const products: Product[] = rawProducts as Product[];
const reviews: Review[] = rawReviews as Review[];

export const productService = {
  async getAllProducts(): Promise<Product[]> {
    return Promise.resolve([...products]);
  },

  async getProductById(id: string): Promise<Product | null> {
    const found = products.find((p) => p.id === id);
    return Promise.resolve(found ? { ...found } : null);
  },

  async getProductsByCategory(categoryId: string, subCategoryId?: string): Promise<Product[]> {
    let list = products.filter((p) => p.categoryId === categoryId);
    if (subCategoryId) {
      list = list.filter((p) => p.subCategoryId === subCategoryId);
    }
    return Promise.resolve(list);
  },

  async getTrendingProducts(limit = 8): Promise<Product[]> {
    const list = products.filter((p) => p.isTrending).slice(0, limit);
    return Promise.resolve(list);
  },

  async getBestSellers(limit = 8): Promise<Product[]> {
    const list = products.filter((p) => p.isBestSeller).slice(0, limit);
    return Promise.resolve(list);
  },

  async getNewArrivals(limit = 8): Promise<Product[]> {
    const list = products.filter((p) => p.isNew).slice(0, limit);
    return Promise.resolve(list);
  },

  async getDealsOfTheDay(): Promise<Product[]> {
    const list = products.filter((p) => p.isDealOfTheDay || p.discount >= 45);
    return Promise.resolve(list);
  },

  async getProductsByTag(tag: string): Promise<Product[]> {
    const list = products.filter((p) => p.tags.includes(tag.toLowerCase()));
    return Promise.resolve(list);
  },

  async getSimilarProducts(productId: string, limit = 6): Promise<Product[]> {
    const current = products.find((p) => p.id === productId);
    if (!current) return Promise.resolve(products.slice(0, limit));

    const similar = products
      .filter((p) => p.id !== productId && (p.subCategoryId === current.subCategoryId || p.categoryId === current.categoryId))
      .slice(0, limit);

    return Promise.resolve(similar.length > 0 ? similar : products.filter((p) => p.id !== productId).slice(0, limit));
  },

  async getProductReviews(productId: string): Promise<Review[]> {
    const prodReviews = reviews.filter((r) => r.productId === productId);
    if (prodReviews.length > 0) return Promise.resolve(prodReviews);

    // Provide contextual mock reviews if none specifically tagged
    const genericReviews: Review[] = [
      {
        id: `rev_gen_1_${productId}`,
        productId,
        userName: 'Pooja Kashyap',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        rating: 5,
        title: 'Outstanding quality and fit',
        comment: 'Loved the drape and premium finish. Exact match with pictures and fast delivery!',
        date: '28 Aug 2026',
        verifiedPurchase: true,
        helpfulCount: 24,
      },
      {
        id: `rev_gen_2_${productId}`,
        productId,
        userName: 'Kabir Varma',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        rating: 4,
        title: 'Great value for the price',
        comment: 'Fabric feels luxurious. Sizing is spot on according to the size chart.',
        date: '15 Aug 2026',
        verifiedPurchase: true,
        helpfulCount: 12,
      },
    ];
    return Promise.resolve(genericReviews);
  },

  async filterAndSortProducts(
    params: {
      categoryId?: string;
      subCategoryId?: string;
      brandId?: string;
      tag?: string;
      searchQuery?: string;
      filters?: Partial<FilterState>;
      sort?: SortOption;
      page?: number;
      limit?: number;
    }
  ): Promise<{ products: Product[]; total: number; hasMore: boolean }> {
    let result = [...products];

    // Primary route targets
    if (params.categoryId) {
      result = result.filter((p) => p.categoryId === params.categoryId);
    }
    if (params.subCategoryId) {
      result = result.filter((p) => p.subCategoryId === params.subCategoryId);
    }
    if (params.brandId) {
      result = result.filter((p) => p.brandId === params.brandId);
    }
    if (params.tag) {
      const t = params.tag.toLowerCase();
      result = result.filter((p) => p.tags.some((tag) => tag.toLowerCase() === t));
    }

    // Search query matching
    if (params.searchQuery && params.searchQuery.trim().length > 0) {
      const q = params.searchQuery.toLowerCase().trim();
      const terms = q.split(' ').filter(Boolean);

      result = result.filter((p) => {
        const fullText = `${p.name} ${p.brandName} ${p.material} ${p.fit} ${p.occasion} ${p.gender} ${p.tags.join(' ')} ${p.description}`.toLowerCase();
        return terms.every((term) => fullText.includes(term));
      });
    }

    // Dynamic Filter State
    const f = params.filters;
    if (f) {
      if (f.categoryIds && f.categoryIds.length > 0) {
        result = result.filter((p) => f.categoryIds!.includes(p.categoryId));
      }
      if (f.subCategoryIds && f.subCategoryIds.length > 0) {
        result = result.filter((p) => f.subCategoryIds!.includes(p.subCategoryId));
      }
      if (f.brandIds && f.brandIds.length > 0) {
        result = result.filter((p) => f.brandIds!.includes(p.brandId));
      }
      if (f.genders && f.genders.length > 0) {
        result = result.filter((p) => f.genders!.includes(p.gender));
      }
      if (f.sizes && f.sizes.length > 0) {
        result = result.filter((p) => p.sizes.some((s) => f.sizes!.includes(s)));
      }
      if (f.colors && f.colors.length > 0) {
        result = result.filter((p) => p.colors.some((c) => f.colors!.includes(c.name)));
      }
      if (f.priceRange) {
        const [minPrice, maxPrice] = f.priceRange;
        result = result.filter((p) => p.price >= minPrice && p.price <= maxPrice);
      }
      if (f.minRating && f.minRating > 0) {
        result = result.filter((p) => p.rating >= f.minRating!);
      }
      if (f.minDiscount && f.minDiscount > 0) {
        result = result.filter((p) => p.discount >= f.minDiscount!);
      }
      if (f.fits && f.fits.length > 0) {
        result = result.filter((p) => f.fits!.includes(p.fit));
      }
      if (f.occasions && f.occasions.length > 0) {
        result = result.filter((p) => f.occasions!.includes(p.occasion));
      }
      if (f.onlyInStock) {
        result = result.filter((p) => p.available && p.stock > 0);
      }
    }

    // Sorting
    const sort = params.sort || 'recommended';
    switch (sort) {
      case 'newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'price_low_high':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_high_low':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'discount':
        result.sort((a, b) => b.discount - a.discount);
        break;
      case 'recommended':
      default:
        result.sort((a, b) => (b.isTrending ? 1 : 0) + (b.isBestSeller ? 1 : 0) - ((a.isTrending ? 1 : 0) + (a.isBestSeller ? 1 : 0)));
        break;
    }

    const total = result.length;
    const page = params.page || 1;
    const limit = params.limit || 20;
    const paginated = result.slice(0, page * limit);

    return Promise.resolve({
      products: paginated,
      total,
      hasMore: paginated.length < total,
    });
  },
};
