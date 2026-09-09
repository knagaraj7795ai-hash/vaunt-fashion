import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useUser } from '../context/UserContext';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { BottomTabNavigator } from './BottomTabNavigator';
import { ProductListingScreen } from '../screens/ProductListingScreen';
import { ProductDetailsScreen } from '../screens/ProductDetailsScreen';
import { CartScreen } from '../screens/CartScreen';
import { CheckoutScreen } from '../screens/CheckoutScreen';
import { OrderConfirmationScreen } from '../screens/OrderConfirmationScreen';
import { OrdersScreen } from '../screens/OrdersScreen';
import { OrderTrackingScreen } from '../screens/OrderTrackingScreen';
import { AddressManagementScreen } from '../screens/AddressManagementScreen';
import { NotificationScreen } from '../screens/NotificationScreen';
import { OffersScreen } from '../screens/OffersScreen';
import { RecentlyViewedScreen } from '../screens/RecentlyViewedScreen';
import { EditProfileScreen } from '../screens/EditProfileScreen';
import { COLORS } from '../constants/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useUser();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.surface }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
          <Stack.Screen name="ProductListing" component={ProductListingScreen} />
          <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
          <Stack.Screen name="Cart" component={CartScreen} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} />
          <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} />
          <Stack.Screen name="Orders" component={OrdersScreen} />
          <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
          <Stack.Screen name="AddressManagement" component={AddressManagementScreen} />
          <Stack.Screen name="Notifications" component={NotificationScreen} />
          <Stack.Screen name="Offers" component={OffersScreen} />
          <Stack.Screen name="RecentlyViewed" component={RecentlyViewedScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};
