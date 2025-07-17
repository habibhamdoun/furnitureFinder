import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '@/types';

const FAVORITES_KEY = 'furniture_finder_favorites';

export const useFavorites = (userId?: string) => {
  const [favorites, setFavorites] = useState<Product[]>([]);

  useEffect(() => {
    if (userId) {
      loadFavorites();
    }
  }, [userId]);

  const loadFavorites = async () => {
    try {
      const favoritesData = await AsyncStorage.getItem(`${FAVORITES_KEY}_${userId}`);
      if (favoritesData) {
        setFavorites(JSON.parse(favoritesData));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const addToFavorites = async (product: Product) => {
    try {
      const updatedFavorites = [...favorites, product];
      setFavorites(updatedFavorites);
      await AsyncStorage.setItem(`${FAVORITES_KEY}_${userId}`, JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  const removeFromFavorites = async (productId: number) => {
    try {
      const updatedFavorites = favorites.filter(item => item.id !== productId);
      setFavorites(updatedFavorites);
      await AsyncStorage.setItem(`${FAVORITES_KEY}_${userId}`, JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  const isFavorite = (productId: number) => {
    return favorites.some(item => item.id === productId);
  };

  return { favorites, addToFavorites, removeFromFavorites, isFavorite };
};