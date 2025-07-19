import ProductCard from '@/components/ProductCard';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useFavorites } from '@/hooks/useFavorites';
import { fetchProducts } from '@/services/api';
import { Product } from '@/types';
import { router } from 'expo-router';
import { Check, Search } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ProductsScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState(''); // Keep if used in filtering logic
  const [maxPrice, setMaxPrice] = useState(''); // Keep if used in filtering logic
  const [showSort, setShowSort] = useState(false);
  const [sortOption, setSortOption] = useState<
    'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | null
  >(null);
  const [predictions, setPredictions] = useState<string[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const { user, loading } = useAuth();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites(
    user?.id,
  );
  const { addToCart } = useCart(user?.id);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/(auth)/login');
      return;
    }
    loadProducts();
  }, [user, loading]);

  const loadProducts = async () => {
    setProductsLoading(true);
    try {
      const data = await fetchProducts(20);
      setProducts(data.products);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setRefreshing(false);
      setProductsLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadProducts();
  };

  // Filtering logic
  let filteredProducts = products.filter(
    (product) =>
      (searchQuery === '' ||
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase())) &&
      (minPrice === '' || product.price >= parseFloat(minPrice)) &&
      (maxPrice === '' || product.price <= parseFloat(maxPrice)),
  );

  // Sorting logic
  if (sortOption === 'price-asc') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortOption === 'price-desc') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortOption === 'name-asc') {
    filteredProducts = [...filteredProducts].sort((a, b) =>
      a.title.localeCompare(b.title),
    );
  } else if (sortOption === 'name-desc') {
    filteredProducts = [...filteredProducts].sort((a, b) =>
      b.title.localeCompare(a.title),
    );
  }

  const renderProduct = (product: Product) => (
    <ProductCard
      key={product.id}
      product={product}
      isFavorite={isFavorite(product.id)}
      onFavoriteToggle={handleFavoriteToggle}
      onAddToCart={handleAddToCart}
      onPress={() => router.push(`/product/${product.id}`)}
    />
  );

  function handleFavoriteToggle(product: Product) {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  }

  function handleAddToCart(product: Product) {
    addToCart(product);
  }

  if (loading) {
    return (
      <View className='flex-1 justify-center items-center bg-gray-50'>
        <Text className='text-base text-gray-400'>Loading...</Text>
      </View>
    );
  }

  return (
    <View className='flex-1 bg-gray-50 pt-14 w-full'>
      <Text className='text-xl font-bold text-gray-900 ml-6 mb-3 mt-2'>
        Products
      </Text>

      <Modal visible={showSort} transparent animationType='fade'>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowSort(false)}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#00000088',
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              borderRadius: 20,
              padding: 24,
              width: 320,
              shadowColor: '#000',
              shadowOpacity: 0.08,
              shadowRadius: 12,
              elevation: 4,
            }}
          >
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 20,
                marginBottom: 18,
                textAlign: 'center',
                color: '#111827',
              }}
            >
              Sort by
            </Text>
            {[
              { key: 'price-asc', label: 'Price: Low to High' },
              { key: 'price-desc', label: 'Price: High to Low' },
              { key: 'name-asc', label: 'Name: A-Z' },
              { key: 'name-desc', label: 'Name: Z-A' },
            ].map((option, idx, arr) => (
              <TouchableOpacity
                key={option.key}
                onPress={() => {
                  setSortOption(option.key as any);
                  setShowSort(false);
                }}
                style={{
                  marginBottom: idx !== arr.length - 1 ? 14 : 0,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical: 14,
                  paddingHorizontal: 18,
                  borderRadius: 16,
                  backgroundColor:
                    sortOption === option.key ? '#3a9b62' : '#fff',
                  borderWidth: 1,
                  borderColor:
                    sortOption === option.key ? '#3a9b62' : '#e5e7eb',
                  shadowColor: '#000',
                  shadowOpacity: sortOption === option.key ? 0.1 : 0.04,
                  shadowRadius: 6,
                  elevation: sortOption === option.key ? 2 : 1,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: sortOption === option.key ? 'white' : '#374151',
                    fontWeight: sortOption === option.key ? 'bold' : '500',
                  }}
                >
                  {option.label}
                </Text>
                {sortOption === option.key && (
                  <Check size={20} color='white' style={{ marginLeft: 8 }} />
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => setShowSort(false)}
              style={{
                marginTop: 18,
                backgroundColor: '#3a9b62',
                borderRadius: 12,
                paddingVertical: 12,
                alignItems: 'center',
              }}
            >
              <Text
                style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}
              >
                Close
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <View className='flex flex-row justify-between w-full'>
        <View className='flex-row items-center bg-gray-100 rounded-xl mx-6 mt-2 mb-3 px-4 h-11'>
          <Search size={20} color='#9CA3AF' style={{ marginRight: 8 }} />
          <TextInput
            className='text-base text-gray-900'
            placeholder='Search for furniture...'
            placeholderTextColor='#9CA3AF'
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              if (text.length > 0) {
                const lower = text.toLowerCase();
                setPredictions(
                  products
                    .map((p) => p.title)
                    .filter((name) => name.toLowerCase().includes(lower))
                    .slice(0, 5),
                );
              } else {
                setPredictions([]);
              }
            }}
            autoCorrect={false}
            autoCapitalize='none'
          />
        </View>
        <View className='flex-row justify-end items-center mx-6 mb-2 gap-2'>
          <TouchableOpacity
            className='bg-gray-200 rounded-lg px-4 py-2'
            onPress={() => setShowSort(true)}
          >
            <Text className='text-gray-700 font-medium'>Sort</Text>
          </TouchableOpacity>
        </View>
      </View>
      {predictions.length > 0 && (
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 8,
            marginHorizontal: 24,
            marginTop: 2,
            elevation: 2,
          }}
        >
          {predictions.map((name, idx) => (
            <TouchableOpacity
              key={name + idx}
              onPress={() => {
                setSearchQuery(name);
                setPredictions([]);
              }}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 16,
                borderBottomWidth: idx !== predictions.length - 1 ? 1 : 0,
                borderColor: '#eee',
              }}
            >
              <Text style={{ color: '#374151', fontSize: 16 }}>{name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <ScrollView
        className=''
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {productsLoading ? (
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
              Loading products...
            </Text>
          </View>
        ) : (
          <View className='flex-row flex-wrap p-4 justify-between'>
            {filteredProducts.map(renderProduct)}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
