import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { UserProvider } from './src/context/UserContext';
import { AddressProvider } from './src/context/AddressContext';
import { WishlistProvider } from './src/context/WishlistContext';
import { CartProvider } from './src/context/CartContext';
import { OrderProvider } from './src/context/OrderContext';
import { NotificationProvider } from './src/context/NotificationContext';
import { RecentlyViewedProvider } from './src/context/RecentlyViewedContext';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <AddressProvider>
          <WishlistProvider>
            <CartProvider>
              <OrderProvider>
                <NotificationProvider>
                  <RecentlyViewedProvider>
                    <NavigationContainer>
                      <StatusBar style="dark" />
                      <RootNavigator />
                    </NavigationContainer>
                  </RecentlyViewedProvider>
                </NotificationProvider>
              </OrderProvider>
            </CartProvider>
          </WishlistProvider>
        </AddressProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
}
