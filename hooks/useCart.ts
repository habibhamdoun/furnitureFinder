import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem, Product } from '@/types';

const CART_KEY = 'furniture_finder_cart';

export const useCart = (userId?: string) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (userId) {
      loadCart();
    }
  }, [userId]);

  const loadCart = async () => {
    try {
      const cartData = await AsyncStorage.getItem(`${CART_KEY}_${userId}`);
      if (cartData) {
        setCartItems(JSON.parse(cartData));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const addToCart = async (product: Product, quantity: number = 1) => {
    try {
      const existingItem = cartItems.find(item => item.product.id === product.id);
      let updatedCart: CartItem[];

      if (existingItem) {
        updatedCart = cartItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updatedCart = [...cartItems, { product, quantity }];
      }

      setCartItems(updatedCart);
      await AsyncStorage.setItem(`${CART_KEY}_${userId}`, JSON.stringify(updatedCart));
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (productId: number) => {
    try {
      const updatedCart = cartItems.filter(item => item.product.id !== productId);
      setCartItems(updatedCart);
      await AsyncStorage.setItem(`${CART_KEY}_${userId}`, JSON.stringify(updatedCart));
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    try {
      if (quantity <= 0) {
        await removeFromCart(productId);
        return;
      }

      const updatedCart = cartItems.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      );

      setCartItems(updatedCart);
      await AsyncStorage.setItem(`${CART_KEY}_${userId}`, JSON.stringify(updatedCart));
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const clearCart = async () => {
    try {
      setCartItems([]);
      await AsyncStorage.removeItem(`${CART_KEY}_${userId}`);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
  };
};