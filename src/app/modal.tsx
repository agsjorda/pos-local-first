import { StatusBar } from 'expo-status-bar';
import { Platform, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Pressable } from 'react-native';
import { useTheme } from '../contexts/themeContext';

export default function Modal() {
  const { isDarkMode } = useTheme();

  return (
    <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <StatusBar style={isDarkMode ? 'light' : Platform.OS === 'ios' ? 'light' : 'auto'} />
      
      {/* Header */}
      <View className={`flex-row justify-between items-center px-5 py-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <Text className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          POS System Info
        </Text>
        <Pressable onPress={() => router.back()} className="p-2">
          <FontAwesome name="times" size={24} color={isDarkMode ? '#9CA3AF' : '#666'} />
        </Pressable>
      </View>
      
      {/* Content */}
      <ScrollView className="flex-1 px-5">
        <View className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-5 mb-4 shadow-sm mt-5`}>
          <Text className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
            About This App
          </Text>
          <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} leading-5 mb-2`}>
            This is a Point of Sale (POS) system designed to help you manage your business operations efficiently.
          </Text>
        </View>
        
        <View className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-5 mb-4 shadow-sm`}>
          <Text className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-3`}>Features</Text>
          <View className="flex-row items-center mb-3">
            <FontAwesome name="check" size={16} color="#007AFF" className="mr-3" />
            <Text className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>Transaction Management</Text>
          </View>
          <View className="flex-row items-center mb-3">
            <FontAwesome name="check" size={16} color="#007AFF" className="mr-3" />
            <Text className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>Inventory Tracking</Text>
          </View>
          <View className="flex-row items-center mb-3">
            <FontAwesome name="check" size={16} color="#007AFF" className="mr-3" />
            <Text className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>Sales Reports</Text>
          </View>
          <View className="flex-row items-center mb-3">
            <FontAwesome name="check" size={16} color="#007AFF" className="mr-3" />
            <Text className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>User Management</Text>
          </View>
        </View>
        
        <View className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-5 mb-4 shadow-sm`}>
          <Text className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-3`}>Version</Text>
          <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} leading-5 mb-2`}>POS System v1.0.0</Text>
          <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} leading-5 mb-2`}>Built with React Native & Expo</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
