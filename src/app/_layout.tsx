import { Stack } from "expo-router";
import { ThemeProvider } from '~/contexts/themeContext';
import { AuthProvider } from '~/contexts/authContext';
import '../../global.css';

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </ThemeProvider>
    </AuthProvider>
  );
}
