import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '@/types';

const FAVORITES_KEY = 'furniture_finder_favorites';

interface FavoritesContextType {
  favorites: Product[];
  addToFavorites: (product: Product) => Promise<void>;
  removeFromFavorites: (productId: number) => Promise<void>;
  isFavorite: (productId: number) => boolean;
  reloadFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ userId, children }: { userId?: string; children: React.ReactNode }) {
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
      } else {
        setFavorites([]);
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

  return (
    <FavoritesContext.Provider value={{
      favorites,
      addToFavorites,
      removeFromFavorites,
      isFavorite,
      reloadFavorites: loadFavorites,
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
