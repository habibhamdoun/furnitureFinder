import React from 'react';
import { Image, Text, View } from 'react-native';

interface FeaturedItemProps {
  item: {
    title: string;
    description: string;
    image: string;
  };
  isLast?: boolean;
}

export default function FeaturedItem({ item, isLast }: FeaturedItemProps) {
  return (
    <View
      className={`bg-white rounded-3xl w-72  mr-5 shadow-md overflow-hidden items-start ${isLast ? 'mr-0' : ''}`}
    >
      <Image
        source={{ uri: item.image }}
        className='w-full h-[300px] rounded-t-3xl mb-3 bg-gray-100'
        style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
      />
      <Text className='text-lg font-bold text-gray-900 ml-4 mb-1 mt-1 text-left'>
        {item.title}
      </Text>
      <Text className='text-base text-gray-500 ml-4 mb-3 text-left'>
        {item.description}
      </Text>
    </View>
  );
}
