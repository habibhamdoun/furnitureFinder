import { useThemeContext } from '@/hooks/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useFavorites } from '@/hooks/useFavorites';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { Camera, LogOut, Moon, Settings, Sun } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActionSheetIOS,
  Alert,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ProfileScreen() {
  const { user, logout, updateUser, loading } = useAuth();
  const { favorites } = useFavorites();
  const [imageLoading, setImageLoading] = useState(false);
  const systemColorScheme = useColorScheme();
  const { theme, setTheme } = useThemeContext();

  React.useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem('theme');
      if (stored === 'light' || stored === 'dark') setTheme(stored);
    })();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const handleProfilePhoto = async () => {
    const showPicker = async (mode: 'camera' | 'gallery') => {
      try {
        if (mode === 'camera') {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert(
              'Permission needed',
              'Camera permission is required to take photos.',
            );
            return;
          }
        } else {
          const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert(
              'Permission needed',
              'Media library permission is required.',
            );
            return;
          }
        }
        setImageLoading(true);
        const result =
          mode === 'camera'
            ? await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
              })
            : await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
              });
        if (!result.canceled && result.assets[0] && user) {
          const updatedUser = {
            ...user,
            profileImage: result.assets[0].uri,
          };
          await updateUser(updatedUser);
        }
      } catch (error) {
        console.error('Error picking photo:', error);
        Alert.alert('Error', 'Failed to pick photo. Please try again.');
      } finally {
        setImageLoading(false);
      }
    };
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Choose from Gallery'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) showPicker('camera');
          if (buttonIndex === 2) showPicker('gallery');
        },
      );
    } else {
      Alert.alert('Profile Photo', 'Choose an option', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Take Photo', onPress: () => showPicker('camera') },
        { text: 'Choose from Gallery', onPress: () => showPicker('gallery') },
      ]);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View className='flex-1 justify-center items-center bg-[#F9FAFB]'>
        <Text className='text-lg font-bold text-[#374151]'>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <View className='flex-1 bg-[#F9FAFB]'>
      <View className='flex-row justify-between items-center px-5 pt-16 pb-5 bg-white'>
        <Text className='text-2xl font-bold text-[#111827]'>Your Profile</Text>
        <View className='flex flex-row gap-3'>
          <TouchableOpacity onPress={toggleTheme}>
            {theme === 'dark' ? (
              <Sun size={24} color='#3a9b62' />
            ) : (
              <Moon size={24} color='#3a9b62' />
            )}
          </TouchableOpacity>
          <TouchableOpacity>
            <Settings size={24} color='#374151' />
          </TouchableOpacity>
        </View>
      </View>

      <View className='flex-1 p-5'>
        <View className='items-center bg-white rounded-2xl p-8 mb-6 shadow-md'>
          <View className='mb-4'>
            {user.profileImage ? (
              <Image
                source={{ uri: user.profileImage }}
                style={{ width: 100, height: 100, borderRadius: 50 }}
                contentFit='cover'
              />
            ) : (
              <View className='w-[100px] h-[100px] rounded-full bg-[#E5D5B7] justify-center items-center'>
                <Text className='text-4xl font-bold text-[#8B4513]'>
                  {user.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </Text>
              </View>
            )}
          </View>

          <Text className='text-2xl font-bold text-[#111827] mb-1'>
            {user.name}
          </Text>
          <Text className='text-base text-[#6B7280]'>{user.email}</Text>
        </View>

        <View className='bg-white rounded-2xl p-5 mb-6 shadow-md'>
          <Text className='text-xl font-bold text-[#111827] mb-4'>
            Favorites
          </Text>

          {favorites.length > 0 ? (
            <View className='flex-row flex-wrap' style={{ gap: 8 }}>
              {favorites.slice(0, 4).map((product) => (
                <TouchableOpacity
                  key={product.id}
                  className='w-[60px] h-[60px] rounded-lg overflow-hidden'
                  onPress={() => router.push(`/product/${product.id}`)}
                >
                  <Image
                    source={{ uri: product.thumbnail }}
                    style={{ width: '100%', height: '100%' }}
                    contentFit='cover'
                  />
                </TouchableOpacity>
              ))}
              {favorites.length > 4 && (
                <TouchableOpacity
                  className='w-[60px] h-[60px] rounded-lg bg-[#F3F4F6] justify-center items-center'
                  onPress={() => router.push('/(tabs)/favorites')}
                >
                  <Text className='text-sm font-semibold text-[#6B7280]'>
                    +{favorites.length - 4}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View className='items-center py-5'>
              <View className='w-[120px] h-20 bg-[#E5D5B7] rounded-lg mb-4' />
              <Text className='text-lg font-bold text-[#111827] mb-2'>
                No favorites yet
              </Text>
              <Text className='text-sm text-[#6B7280] text-center mb-4'>
                Start adding items to your favorites list.
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          className='flex-row items-center justify-center bg-[#E5E7EB] rounded-xl p-4 mb-4'
          onPress={handleProfilePhoto}
          disabled={imageLoading}
        >
          <Camera size={20} color='#374151' />
          <Text className='text-base font-semibold text-[#374151] ml-2'>
            {imageLoading ? 'Taking Photo...' : 'Change Profile Photo'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className='flex-row items-center justify-center bg-[#3a9b62] rounded-xl p-4'
          onPress={handleLogout}
        >
          <LogOut size={20} color='#FFFFFF' />
          <Text className='text-base font-semibold text-white ml-2'>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
