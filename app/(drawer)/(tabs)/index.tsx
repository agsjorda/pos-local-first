import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '~/lib/themeContext';

export default function Home() {
  const { isDarkMode } = useTheme();

  return (
    <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <ScrollView className="flex-1 p-5">
        <View className="items-center mb-8 pt-5">
          <Text className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            Welcome Home
          </Text>
          <Text className={`text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-center`}>
            Your POS System Dashboard
          </Text>
        </View>
        
        <View className="flex-1">
          <View className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-5 mb-4 shadow-md`}>
            <Text className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
              Quick Actions
            </Text>
            <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} leading-5`}>
              Use the drawer menu to navigate through different sections of your POS system.
            </Text>
          </View>
          
          <View className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-5 mb-4 shadow-md`}>
            <Text className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
              System Status
            </Text>
            <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} leading-5`}>
              All systems are running smoothly. You're ready to process transactions.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
