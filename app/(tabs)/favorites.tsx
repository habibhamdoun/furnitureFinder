import ProductCard from '@/components/ProductCard';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useFavorites } from '@/hooks/useFavorites';
import { Product } from '@/types';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { Package } from 'lucide-react-native';
import React, { useCallback } from 'react';
import { ScrollView, Text, View } from 'react-native';

export default function FavoritesScreen() {
  const { user } = useAuth();
  const { favorites, removeFromFavorites, reloadFavorites } = useFavorites(
    user?.id,
  );
  const { addToCart } = useCart(user?.id);

  useFocusEffect(
    useCallback(() => {
      reloadFavorites();
    }, [user?.id]),
  );

  const handleRemoveFromFavorites = (productId: number) => {
    removeFromFavorites(productId);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  const renderProduct = (product: Product) => (
    <ProductCard
      key={product.id}
      product={product}
      onFavoriteToggle={() => handleRemoveFromFavorites(product.id)}
      onAddToCart={handleAddToCart}
      onPress={() => router.push(`/product/${product.id}`)}
      isFavorite={true}
    />
  );

  return (
    <View className='flex-1 bg-gray-50'>
      <View className='px-5 pt-16 pb-5 bg-white'>
        <Text className='text-2xl font-bold text-gray-900'>Favorites</Text>
      </View>

      <ScrollView className='flex-1'>
        {favorites.length > 0 ? (
          <View className='flex-row flex-wrap p-4 justify-between'>
            {favorites.map(renderProduct)}
          </View>
        ) : (
          <View className='flex-1 justify-center items-center p-8'>
            <View className='bg-gray-100 rounded-full p-6 mb-6'>
              <Package size={64} color='#D1D5DB' />
            </View>
            <Text className='text-2xl font-bold text-gray-900 mb-2'>
              No favorites yet
            </Text>
            <Text className='text-base text-gray-500'>
              Start adding items to your favorites list.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
