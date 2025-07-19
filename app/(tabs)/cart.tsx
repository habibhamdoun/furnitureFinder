import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { CartItem } from '@/types';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react-native';
import React from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function CartScreen() {
  const { user } = useAuth();
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } =
    useCart();

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      Alert.alert(
        'Remove Item',
        'Are you sure you want to remove this item from your cart?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Remove',
            style: 'destructive',
            onPress: () => removeFromCart(productId),
          },
        ],
      );
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    Alert.alert(
      'Checkout',
      `Total: $${getCartTotal().toFixed(
        2,
      )}\n\nThis is a demo app. Checkout functionality would be implemented here.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete Order',
          onPress: () => {
            clearCart();
            Alert.alert('Success', 'Order placed successfully!');
          },
        },
      ],
    );
  };

  const renderCartItem = (item: CartItem) => (
    <View
      key={item.product.id}
      className='flex-row items-center bg-white rounded-lg p-4 mb-4 shadow-sm'
    >
      <TouchableOpacity
        onPress={() => router.push(`/product/${item.product.id}`)}
      >
        <Image
          source={{ uri: item.product.thumbnail }}
          style={{ width: 96, height: 96, borderRadius: 8, marginRight: 16 }}
          contentFit='cover'
        />
      </TouchableOpacity>

      <View className='flex-1'>
        <TouchableOpacity
          onPress={() => router.push(`/product/${item.product.id}`)}
        >
          <Text className='text-lg font-bold text-gray-900' numberOfLines={2}>
            {item.product.title}
          </Text>
        </TouchableOpacity>
        <Text className='text-base text-gray-700 font-semibold mt-1'>
          ${item.product.price}
        </Text>

        <View className='flex-row items-center mt-2'>
          <TouchableOpacity
            className='w-8 h-8 rounded-full bg-gray-200 items-center justify-center mr-2'
            onPress={() =>
              handleQuantityChange(item.product.id, item.quantity - 1)
            }
          >
            <Minus size={16} color='#374151' />
          </TouchableOpacity>

          <Text className='text-base font-semibold mx-2'>{item.quantity}</Text>

          <TouchableOpacity
            className='w-8 h-8 rounded-full bg-gray-200 items-center justify-center ml-2'
            onPress={() =>
              handleQuantityChange(item.product.id, item.quantity + 1)
            }
          >
            <Plus size={16} color='#374151' />
          </TouchableOpacity>
        </View>
      </View>

      <View className='items-end ml-4'>
        <Text className='text-base font-bold text-gray-900 mb-2'>
          ${(item.product.price * item.quantity).toFixed(2)}
        </Text>
        <TouchableOpacity
          className='p-2 rounded-full bg-red-100'
          onPress={() => removeFromCart(item.product.id)}
        >
          <Trash2 size={16} color='#EF4444' />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className='flex-1 bg-gray-50'>
      <View className='flex-row justify-between items-center px-5 pt-16 pb-5 bg-white'>
        <Text className='text-2xl font-bold text-gray-900'>Cart</Text>
        {cartItems.length > 0 && (
          <TouchableOpacity onPress={clearCart}>
            <Text className='text-base text-red-500 font-semibold'>
              Clear All
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {cartItems.length > 0 ? (
        <>
          <ScrollView className='flex-1 p-4'>
            {cartItems.map(renderCartItem)}
          </ScrollView>

          <View className='p-4 border-t border-gray-200 bg-white'>
            <View className='flex-row justify-between items-center mb-4'>
              <Text className='text-lg font-semibold text-gray-700'>
                Total:
              </Text>
              <Text className='text-2xl font-bold text-green-700'>
                ${getCartTotal().toFixed(2)}
              </Text>
            </View>

            <TouchableOpacity
              className='bg-green-600 rounded-lg py-4 items-center'
              onPress={handleCheckout}
            >
              <Text className='text-white text-lg font-bold'>Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View className='flex-1 justify-center items-center p-8'>
          <View className='bg-gray-100 rounded-full p-6 mb-6'>
            <ShoppingBag size={64} color='#D1D5DB' />
          </View>
          <Text className='text-2xl font-bold text-gray-900 mb-2'>
            Your cart is empty
          </Text>
          <Text className='text-base text-gray-500 mb-6'>
            Add some furniture to get started.
          </Text>
          <TouchableOpacity
            className='bg-green-600 rounded-lg py-3 px-8'
            onPress={() => router.push('/(tabs)')}
          >
            <Text className='text-white text-lg font-bold'>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
