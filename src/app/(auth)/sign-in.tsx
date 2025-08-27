// app/auth/SignInScreen.tsx
import { View, Text, TextInput, Pressable, Switch, Alert, Image } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '~/contexts/themeContext';
import { useAuth } from '~/contexts/authContext';
import { router } from 'expo-router';

export default function SignInScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const { isDarkMode } = useTheme();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Load remembered credentials on mount
  useEffect(() => {
    (async () => {
      try {
        const creds = await AsyncStorage.getItem('remembered_credentials');
        if (creds) {
          const { email, password } = JSON.parse(creds);
          setEmail(email);
          setPassword(password);
          setRememberMe(true);
        }
      } catch {}
    })();
  }, []);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    try {
      await signIn(email, password);
      if (rememberMe) {
        await AsyncStorage.setItem('remembered_credentials', JSON.stringify({ email, password }));
      } else {
        await AsyncStorage.removeItem('remembered_credentials');
      }
      Alert.alert('Success', 'Signed in successfully!');
      // Optionally navigate to home or dashboard here
    } catch (error: any) {
      Alert.alert('Sign In Failed', error.message || 'Invalid credentials');
    }
  };

  // Google sign-in removed

  return (
    <View className={`flex-1 justify-center px-6 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Logo */}
      <Image
        source={require('../../../assets/migoys.jpg')}
        style={{ width: 150, height: 150, alignSelf: 'center', marginBottom: 12 }}
        resizeMode="contain"
      />
      {/* Title */}
      <Text
        className={`mb-2 text-center text-3xl font-bold ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>
        Welcome to Migoys
      </Text>
      <Text className={`mb-8 text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
        Sign in to your account
      </Text>

      {/* Form */}
      <View className="gap-5">
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          className={`rounded-xl border px-5 py-4 ${
            isDarkMode
              ? 'border-gray-700 bg-gray-800 text-white'
              : 'border-gray-300 bg-gray-50 text-gray-900'
          }`}
        />

        <View className="relative">
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            className={`rounded-xl border px-5 py-4 pr-12 ${
              isDarkMode
                ? 'border-gray-700 bg-gray-800 text-white'
                : 'border-gray-300 bg-gray-50 text-gray-900'
            }`}
          />
          <Pressable
            onPress={() => setShowPassword((prev) => !prev)}
            className="absolute right-4 top-1/2 -translate-y-1/2"
            accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
          >
            <Feather
              name={showPassword ? 'eye-off' : 'eye'}
              size={22}
              color={isDarkMode ? '#fff' : '#333'}
            />
          </Pressable>
        </View>


        <View className="mb-6 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Switch
              value={rememberMe}
              onValueChange={setRememberMe}
              trackColor={{ false: '#767577', true: '#007AFF' }}
              thumbColor={rememberMe ? '#fff' : '#f4f3f4'}
            />
            <Text className={`ml-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Remember me
            </Text>
          </View>
          <Pressable onPress={() => Alert.alert('Forgot Password', 'Redirect to reset screen')}>
            <Text className="text-blue-500">Forgot Password?</Text>
          </Pressable>
        </View>

        {/* Sign In Button */}
        <Pressable onPress={handleAuth} className="rounded-xl bg-blue-600 py-4 active:bg-blue-700">
          <Text className="text-center font-medium text-white">Sign In</Text>
        </Pressable>

        {/* OR Divider */}
        <View className="my-6 flex-row items-center">
          <View className="h-px flex-1 bg-gray-300 dark:bg-gray-700" />
          <Text className="px-4 text-gray-500 dark:text-gray-400">or</Text>
          <View className="h-px flex-1 bg-gray-300 dark:bg-gray-700" />
        </View>

        {/* Google Sign-In removed */}
      </View>

      {/* Footer */}
      <View className="mt-8">
        <Text className={`text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Don't have an account?{' '}
          <Pressable onPress={() => router.push('/sign-up')}>
            <Text className="font-medium text-blue-500">Sign Up</Text>
          </Pressable>
        </Text>
        <Text
          className={`mt-4 text-center text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          By signing in, you agree to our <Text className="text-blue-500">Terms of Service</Text> and{' '}
          <Text className="text-blue-500">Privacy Policy</Text>
        </Text>
      </View>
    </View>
  );
}
