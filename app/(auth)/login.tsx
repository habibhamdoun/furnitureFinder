import { validateLogin } from '@/constants/users';
import { useAuth } from '@/hooks/useAuth';
import { router } from 'expo-router';
import { ArrowLeft, Lock, Mail } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);

    const user = validateLogin(email, password);

    if (user) {
      await login(user);
      router.replace('/(tabs)');
    } else {
      Alert.alert('Error', 'Invalid email or password');
    }

    setLoading(false);
  };

  return (
    <View className='flex-1 bg-gray-100 p-6'>
      <TouchableOpacity className='mt-10 mb-5' onPress={() => router.back()}>
        <ArrowLeft size={24} color='#374151' />
      </TouchableOpacity>

      <Text className='text-4xl font-bold text-gray-900 mb-10'>Log In</Text>

      <View className='flex-1'>
        <View className='mb-6'>
          <Text className='text-base font-semibold text-gray-700 mb-2'>
            Email
          </Text>
          <View className='relative'>
            <TextInput
              className='bg-white rounded-xl p-4 pr-12 text-base border border-gray-200'
              placeholder='Enter your email'
              value={email}
              onChangeText={setEmail}
              keyboardType='email-address'
              autoCapitalize='none'
            />
            <Mail
              size={20}
              color='#9CA3AF'
              style={{ position: 'absolute', right: 16, top: 18 }}
            />
          </View>
        </View>

        <View className='mb-6'>
          <Text className='text-base font-semibold text-gray-700 mb-2'>
            Password
          </Text>
          <View className='relative'>
            <TextInput
              className='bg-white rounded-xl p-4 pr-12 text-base border border-gray-200'
              placeholder='Enter password'
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <Lock
              size={20}
              color='#9CA3AF'
              style={{ position: 'absolute', right: 16, top: 18 }}
            />
          </View>
        </View>

        <TouchableOpacity
          className={`bg-green-700 rounded-xl p-4 items-center mt-5${loading ? ' opacity-60' : ''}`}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text className='text-white text-base font-bold'>
            {loading ? 'Logging in...' : 'Log In'}
          </Text>
        </TouchableOpacity>
      </View>

      <View className='bg-white rounded-xl p-4 mt-5'>
        <Text className='text-sm font-semibold text-gray-700 mb-2'>
          Demo Accounts:
        </Text>
        <Text className='text-sm text-gray-400 mb-1'>
          ethan.carter@email.com
        </Text>
        <Text className='text-sm text-gray-400 mb-1'>
          sarah.johnson@email.com
        </Text>
        <Text className='text-sm text-gray-400 mb-1'>
          mike.wilson@email.com
        </Text>
        <Text className='text-xs text-gray-300 italic mt-2'>
          Use any password
        </Text>
      </View>
    </View>
  );
}
