import { Product } from '@/types';

const BASE_URL = 'https://dummyjson.com';

export const fetchProducts = async (
  limit: number = 20,
  skip: number = 0,
): Promise<{ products: Product[]; total: number }> => {
  try {
    const response = await fetch(
      `${BASE_URL}/products/category/furniture?limit=${limit}&skip=${skip}`,
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const fetchProduct = async (id: number): Promise<Product> => {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

export const searchProducts = async (
  query: string,
): Promise<{ products: Product[]; total: number }> => {
  try {
    const response = await fetch(
      `${BASE_URL}/products/search?q=${query}&category=furniture`,
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

export const fetchCategories = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${BASE_URL}/products/categories`);
    const data = await response.json();
    return data.filter(
      (category: string) =>
        category.toLowerCase().includes('furniture') ||
        category.toLowerCase().includes('home') ||
        category.toLowerCase().includes('decoration'),
    );
  } catch (error) {
    console.error('Error fetching categories:', error);
    return ['furniture'];
  }
};
