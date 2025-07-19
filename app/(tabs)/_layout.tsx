import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { Tabs } from 'expo-router';
import {
  Heart,
  Chrome as Home,
  ShoppingCart,
  Sofa,
  User,
} from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';

export default function TabLayout() {
  const { user } = useAuth();
  const { getCartItemsCount } = useCart(user?.id);

  const CartIcon = ({
    color,
    focused,
  }: {
    color: string;
    focused: boolean;
  }) => {
    const itemCount = getCartItemsCount();

    return (
      <View style={{ position: 'relative' }}>
        <ShoppingCart size={24} color={color} />
        {itemCount > 0 && (
          <View
            style={{
              position: 'absolute',
              top: -8,
              right: -8,
              backgroundColor: '#EF4444',
              borderRadius: 10,
              minWidth: 20,
              height: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: 'white',
                fontSize: 12,
                fontWeight: 'bold',
              }}
            >
              {itemCount > 99 ? '99+' : itemCount}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#3a9b62',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingTop: 8,
          paddingBottom: 8,
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name='products'
        options={{
          title: 'Products',
          tabBarIcon: ({ color }) => <Sofa size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name='favorites'
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color }) => <Heart size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name='cart'
        options={{
          title: 'Cart',
          tabBarIcon: CartIcon,
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
