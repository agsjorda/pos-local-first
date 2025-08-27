import { Tabs } from 'expo-router';
import { TabBarIcon } from '../../../components/TabBarIcon';
import { useTheme } from '../../../contexts/themeContext';

export default function TabLayout() {
  const { isDarkMode } = useTheme();
  
  return (
    <Tabs
    screenOptions={{
      tabBarActiveTintColor: '#007AFF',
      tabBarInactiveTintColor: '#8E8E93',
      headerShown: false,
      tabBarStyle: {
        backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
        borderTopColor: isDarkMode ? '#374151' : '#E5E7EB',
      },
    }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }: { color: string }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color }: { color: string }) => <TabBarIcon name="shopping-bag" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }: { color: string }) => <TabBarIcon name="cog" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }: { color: string }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}

