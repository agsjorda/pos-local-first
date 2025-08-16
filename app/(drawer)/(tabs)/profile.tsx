import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../lib/themeContext';

export default function Profile() {
  const { isDarkMode } = useTheme();

  return (
    <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <ScrollView className="flex-1 p-5">
        <View className="items-center mb-8 pt-5">
          <View className="mb-4">
            <View className="w-20 h-20 rounded-full bg-blue-500 justify-center items-center">
              <Text className="text-3xl font-bold text-white">JD</Text>
            </View>
          </View>
          <Text className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
            John Doe
          </Text>
          <Text className={`text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            POS Manager
          </Text>
        </View>
        
        <View className="flex-1">
          <View className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-5 mb-4 shadow-md`}>
            <Text className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
              Personal Information
            </Text>
            <View className="flex-row justify-between mb-3">
              <Text className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Email:</Text>
              <Text className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                john.doe@company.com
              </Text>
            </View>
            <View className="flex-row justify-between mb-3">
              <Text className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Phone:</Text>
              <Text className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                +1 (555) 123-4567
              </Text>
            </View>
            <View className="flex-row justify-between mb-3">
              <Text className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Location:</Text>
              <Text className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                New York, NY
              </Text>
            </View>
          </View>
          
          <View className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-5 mb-4 shadow-md`}>
            <Text className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
              Work Statistics
            </Text>
            <View className="flex-row justify-around">
              <View className="items-center">
                <Text className="text-2xl font-bold text-blue-500 mb-1">156</Text>
                <Text className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Transactions
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-blue-500 mb-1">$12,450</Text>
                <Text className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Revenue
                </Text>
              </View>
            </View>
          </View>
          
          <View className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-5 mb-4 shadow-md`}>
            <Text className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
              Recent Activity
            </Text>
            <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} leading-5`}>
              • Processed 5 transactions today{'\n'}
              • Updated inventory at 2:30 PM{'\n'}
              • Generated daily report at 6:00 PM
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
