import { Drawer } from 'expo-router/drawer';
import { HeaderButton } from '~/components/HeaderButton';
import { useTheme } from '../../contexts/themeContext';

export default function DrawerLayout() {
  const { isDarkMode } = useTheme();

  return (
    <Drawer
      screenOptions={{
        headerRight: () => <HeaderButton />,
        headerStyle: {
          backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
        },
        headerTintColor: isDarkMode ? '#FFFFFF' : '#000000',
        drawerStyle: {
          backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
        },
        drawerActiveTintColor: '#007AFF',
        drawerInactiveTintColor: isDarkMode ? '#9CA3AF' : '#6B7280',
      }}>
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: 'Home',
          title: 'Home',
        }}
      />
      <Drawer.Screen
        name="admin"
        options={{
          drawerLabel: 'Admin Panel',
          title: 'Admin Panel',
        }}
      />
    </Drawer>
  );
}
