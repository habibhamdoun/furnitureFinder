import { Product } from '@/types';
import { Image } from 'expo-image';
import { Heart, ShoppingCart } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Toast } from 'toastify-react-native';

interface ProductCardProps {
  product: Product;
  isFavorite?: boolean;
  onFavoriteToggle?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onPress?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isFavorite,
  onFavoriteToggle,
  onAddToCart,
  onPress,
}) => {
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
      Toast.success('Added to cart!');
    }
  };

  const handleFavoriteToggle = () => {
    if (onFavoriteToggle) {
      onFavoriteToggle(product);
      Toast.success(
        isFavorite ? 'Removed from favorites' : 'Added to favorites!',
      );
    }
  };

  return (
    <TouchableOpacity
      className='w-[48%] bg-white rounded-xl mb-4 shadow-sm'
      onPress={() => onPress && onPress(product)}
      activeOpacity={0.9}
    >
      <View className='relative'>
        <Image
          source={{ uri: product.thumbnail }}
          style={{
            width: '100%',
            height: 144,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          }}
          contentFit='cover'
        />
        {onFavoriteToggle && (
          <TouchableOpacity
            className='absolute top-2 right-2 bg-white rounded-full p-2 shadow'
            onPress={handleFavoriteToggle}
            activeOpacity={0.7}
          >
            <Heart
              size={20}
              color={isFavorite ? '#EF4444' : '#9CA3AF'}
              fill={isFavorite ? '#EF4444' : 'transparent'}
            />
          </TouchableOpacity>
        )}
      </View>

      <View className='p-3'>
        <Text
          className='text-base font-semibold text-gray-900 mb-1'
          numberOfLines={2}
        >
          {product.title}
        </Text>
        <Text className='text-sm text-gray-400 mb-2' numberOfLines={2}>
          {product.description}
        </Text>
        <View className='flex-row justify-between items-center'>
          <Text className='text-lg font-bold text-green-700'>
            ${product.price}
          </Text>
          {onAddToCart && (
            <TouchableOpacity
              className='bg-green-700 rounded-full p-2'
              onPress={handleAddToCart}
              activeOpacity={0.7}
            >
              <ShoppingCart size={16} color='#FFFFFF' />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;
