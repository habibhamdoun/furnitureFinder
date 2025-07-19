import FeaturedItem from '@/components/FeaturedItem';
import { fetchProducts } from '@/services/api';
import { Product } from '@/types';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const categories = [
  'furniture',
  'beds',
  'bedside tables',
  'office chairs',
  'bathroom',
];

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await fetchProducts(50);
        setProducts(data.products);
      } catch (e) {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const filteredProducts = selectedTag
    ? products.filter((product) => product.tags?.includes(selectedTag))
    : products;
  const router = useRouter();

  return (
    <View className='flex-1 bg-gray-50 pt-12'>
      <View className='flex-row items-center justify-between px-6 pt-6 pb-3'>
        <Text className='text-xl font-bold text-gray-900'>
          Furniture Finder
        </Text>
      </View>
      <View className='px-6 mb-4'>
        <TouchableOpacity
          className='bg-green-600 rounded-xl py-3 items-center mb-2'
          onPress={() => router.push('/(tabs)/products')}
          activeOpacity={0.85}
        >
          <Text className='text-base font-semibold text-white'>SHOP NOW</Text>
        </TouchableOpacity>
      </View>
      <Text className='text-xl font-bold text-gray-900 ml-6 mb-3 mt-2'>
        Categories
      </Text>
      <View className='flex gap-6'>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className='pl-4 mb-6'
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              className={`rounded-2xl px-5 py-2 mr-3 ${selectedTag === cat ? 'bg-green-600' : 'bg-gray-200'}`}
              onPress={() => setSelectedTag(selectedTag === cat ? null : cat)}
            >
              <Text
                className={`text-base font-medium ${selectedTag === cat ? 'text-white' : 'text-gray-600'}`}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <ScrollView className='px-4'>
          {loading ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                height: 200,
              }}
            >
              <ActivityIndicator size='large' color='#3a9b62' />
              <Text style={{ color: '#3a9b62', marginTop: 12 }}>
                Loading featured items...
              </Text>
            </View>
          ) : filteredProducts.length === 0 ? (
            <Text className='text-center text-gray-400 mt-10'>
              No products found.
            </Text>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 16 }}
            >
              {filteredProducts.map((product, idx) => (
                <FeaturedItem
                  key={product.id}
                  item={{
                    title: product.title,
                    description: product.description,
                    image: product.thumbnail,
                  }}
                  isLast={idx === filteredProducts.length - 1}
                />
              ))}
            </ScrollView>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
