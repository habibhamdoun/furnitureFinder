import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '../global.css';

import SplashScreen from '@/components/SplashScreen';
import {
  ThemeProvider as CustomThemeProvider,
  useThemeContext,
} from '@/hooks/ThemeContext';
import { AuthProvider } from '@/hooks/useAuth';
import { CartProvider } from '@/hooks/useCart';
import { FavoritesProvider } from '@/hooks/useFavorites';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import React, { useEffect, useState } from 'react';
import ToastManager from 'toastify-react-native';

export default function RootLayout() {
  const [splashVisible, setSplashVisible] = useState(true);
  useFrameworkReady();
  const [loaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });
  useEffect(() => {
    setTimeout(() => setSplashVisible(false), 1500);
  }, []);
  if (!loaded) return null;

  return (
    <AuthProvider>
      <CustomThemeProvider>
        <AuthUserProviders splashVisible={splashVisible} />
      </CustomThemeProvider>
    </AuthProvider>
  );
}

function AuthUserProviders({ splashVisible }: { splashVisible: boolean }) {
  const { user } = require('@/hooks/useAuth').useAuth();
  return (
    <CartProvider userId={user?.id}>
      <FavoritesProvider userId={user?.id}>
        {splashVisible ? <SplashScreen /> : <ThemeConsumerApp />}
      </FavoritesProvider>
    </CartProvider>
  );
}

function ThemeConsumerApp() {
  const { theme } = useThemeContext();
  return (
    <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <ToastManager useModal={false} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='(auth)' />
        <Stack.Screen name='(tabs)' />
        <Stack.Screen name='product/[id]' />
        <Stack.Screen name='+not-found' />
      </Stack>
      <StatusBar style='auto' />
    </ThemeProvider>
  );
}
