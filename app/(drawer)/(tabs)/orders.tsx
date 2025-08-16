import { View, Text } from 'react-native';
import { useTheme } from '../../../lib/themeContext';

export default function OrdersPageLayout() {
  const { isDarkMode } = useTheme();

  return (
    <View className={`flex-1 p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header />
      <MainContent />
    </View>
  );
}

function Header() {
  const { isDarkMode } = useTheme();

  return (
    <View className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} py-2 px-4 rounded-lg`}>
      <Text className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Orders
      </Text>
    </View>
  );
}

function MainContent() {
  return (
    <View className="mt-4">
      <Card />
      <Card />
      <Card />
    </View>
  );
}

function Card() {
  const { isDarkMode } = useTheme();

  return (
    <View className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-md shadow-md p-4 m-2`}>
      <Text className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Order #123
      </Text>
      <Text className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        Customer: John Doe
      </Text>
      <Text className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        Date: 2023-02-20
      </Text>
    </View>
  );
}
