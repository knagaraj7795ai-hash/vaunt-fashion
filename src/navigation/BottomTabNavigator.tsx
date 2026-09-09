import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabParamList } from '../types/navigation';
import { HomeScreen } from '../screens/HomeScreen';
import { CategoryScreen } from '../screens/CategoryScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { WishlistScreen } from '../screens/WishlistScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { useWishlist } from '../context/WishlistContext';
import { COLORS, TYPOGRAPHY } from '../constants/theme';

const Tab = createBottomTabNavigator<BottomTabParamList>();

export const BottomTabNavigator: React.FC = () => {
  const { totalWishlistCount } = useWishlist();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          paddingTop: 6,
          paddingBottom: Math.max(insets.bottom, 8),
        },
        tabBarLabelStyle: {
          ...TYPOGRAPHY.micro,
          fontSize: 10,
          fontWeight: '700',
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="CategoryTab"
        component={CategoryScreen}
        options={{
          tabBarLabel: 'Categories',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'grid' : 'grid-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="SearchTab"
        component={SearchScreen}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'search' : 'search-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="WishlistTab"
        component={WishlistScreen}
        options={{
          tabBarLabel: 'Wishlist',
          tabBarBadge: totalWishlistCount > 0 ? totalWishlistCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: COLORS.rose,
            fontSize: 10,
            fontWeight: '800',
          },
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'heart' : 'heart-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={22} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
