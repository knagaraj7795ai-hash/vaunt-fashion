import { NavigatorScreenParams } from '@react-navigation/native';

export type BottomTabParamList = {
  HomeTab: undefined;
  CategoryTab: undefined;
  SearchTab: { initialQuery?: string } | undefined;
  WishlistTab: undefined;
  ProfileTab: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<BottomTabParamList>;
  ProductListing: {
    title?: string;
    categoryId?: string;
    subCategoryId?: string;
    brandId?: string;
    tag?: string;
    searchQuery?: string;
    isDeal?: boolean;
  };
  ProductDetails: {
    productId: string;
  };
  Cart: undefined;
  Checkout: undefined;
  OrderConfirmation: {
    orderId: string;
  };
  Orders: undefined;
  OrderTracking: {
    orderId: string;
  };
  AddressManagement: {
    selectMode?: boolean;
  } | undefined;
  Notifications: undefined;
  Offers: undefined;
  RecentlyViewed: undefined;
};
