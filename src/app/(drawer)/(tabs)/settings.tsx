import { View, Text, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useTheme } from '../../../contexts/themeContext';

export default function Settings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <ScrollView className="flex-1 p-5">
        <View className="items-center mb-8 pt-5">
          <Text className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Settings</Text>
          <Text className={`text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-center`}>
            Customize your experience
          </Text>
        </View>
        
        <View className="flex-1">
          <View className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-5 mb-4 shadow-md`}>
            <Text className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
              Appearance
            </Text>
            <View className="flex-row justify-between items-center mb-4">
              <Text className={`text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Dark Mode</Text>
              <Switch
                value={isDarkMode}
                onValueChange={toggleDarkMode}
                trackColor={{ false: '#767577', true: '#007AFF' }}
                thumbColor={isDarkMode ? '#fff' : '#f4f3f4'}
              />
            </View>
          </View>
          
          <View className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-5 mb-4 shadow-md`}>
            <Text className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
              Notifications
            </Text>
            <View className="flex-row justify-between items-center mb-4">
              <Text className={`text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Push Notifications</Text>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#767577', true: '#007AFF' }}
                thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
              />
            </View>
          </View>
          
          <View className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-5 mb-4 shadow-md`}>
            <Text className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
              Data & Sync
            </Text>
            <View className="flex-row justify-between items-center mb-4">
              <Text className={`text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Auto Sync</Text>
              <Switch
                value={autoSyncEnabled}
                onValueChange={setAutoSyncEnabled}
                trackColor={{ false: '#767577', true: '#007AFF' }}
                thumbColor={autoSyncEnabled ? '#fff' : '#f4f3f4'}
              />
            </View>
          </View>
          
          <View className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-5 mb-4 shadow-md`}>
            <Text className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
              About
            </Text>
            <View className="flex-row justify-between mb-3">
              <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Version</Text>
              <Text className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'} font-medium`}>1.0.0</Text>
            </View>
            <View className="flex-row justify-between mb-3">
              <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Build</Text>
              <Text className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'} font-medium`}>2024.01.15</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
