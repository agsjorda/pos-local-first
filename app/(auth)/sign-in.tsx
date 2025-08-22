// app/auth/SignInScreen.tsx
import { View, Text, TextInput, Pressable, Switch, Alert, Platform } from 'react-native';
import { useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { useTheme } from '~/lib/themeContext';
import { router } from 'expo-router';

export default function SignInScreen() {
  const { isDarkMode } = useTheme();
  const [isSignIn, setIsSignIn] = useState(true); // true = Sign In, false = Sign Up
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleAuth = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (!isSignIn && password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    const action = isSignIn ? 'Signing in' : 'Signing up';
    Alert.alert('Success', `${action} with ${email}`);
  };

  const handleGoogleSignIn = () => {
    Alert.alert(
      'Google Sign-In',
      'Google sign-in pressed. Implement with Firebase, Expo Auth, etc.'
    );
  };

  return (
    <View className={`flex-1 justify-center px-6 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Title */}
      <Text
        className={`mb-2 text-center text-3xl font-bold ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>
        Welcome Back
      </Text>
      <Text className={`mb-8 text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
        {isSignIn ? 'Sign in to your account' : 'Create a new account'}
      </Text>

      {/* Tabs: Sign In / Sign Up */}
      <View className="mb-8 w-64 flex-row self-center rounded-full bg-gray-100 p-1 dark:bg-gray-700">
        <Pressable
          className={`flex-1 rounded-full px-4 py-2 ${
            isSignIn ? 'bg-white shadow-sm dark:bg-gray-600' : 'opacity-70'
          }`}
          onPress={() => router.push('/sign-in')}>
          <Text
            className={`text-center font-medium ${
              isSignIn ? (isDarkMode ? 'text-white' : 'text-gray-800') : 'text-gray-500'
            }`}>
            Sign In
          </Text>
        </Pressable>
        <Pressable
          className={`flex-1 rounded-full px-4 py-2 ${
            !isSignIn ? 'bg-white shadow-sm dark:bg-gray-600' : 'opacity-70'
          }`}
          onPress={() => router.push('/sign-up')}>
          <Text
            className={`text-center font-medium ${
              !isSignIn ? (isDarkMode ? 'text-white' : 'text-gray-800') : 'text-gray-500'
            }`}>
            Sign Up
          </Text>
        </Pressable>
      </View>

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

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          className={`rounded-xl border px-5 py-4 ${
            isDarkMode
              ? 'border-gray-700 bg-gray-800 text-white'
              : 'border-gray-300 bg-gray-50 text-gray-900'
          }`}
        />

        {!isSignIn && (
          <TextInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
            className={`rounded-xl border px-5 py-4 ${
              isDarkMode
                ? 'border-gray-700 bg-gray-800 text-white'
                : 'border-gray-300 bg-gray-50 text-gray-900'
            }`}
          />
        )}

        {isSignIn && (
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
        )}

        {/* Sign In Button */}
        <Pressable onPress={handleAuth} className="rounded-xl bg-blue-600 py-4 active:bg-blue-700">
          <Text className="text-center font-medium text-white">
            {isSignIn ? 'Sign In' : 'Sign Up'}
          </Text>
        </Pressable>

        {/* OR Divider */}
        <View className="my-6 flex-row items-center">
          <View className="h-px flex-1 bg-gray-300 dark:bg-gray-700" />
          <Text className="px-4 text-gray-500 dark:text-gray-400">or</Text>
          <View className="h-px flex-1 bg-gray-300 dark:bg-gray-700" />
        </View>

        {/* Google Sign-In Button */}
        <Pressable
          onPress={handleGoogleSignIn}
          className={`flex-row items-center justify-center gap-3 rounded-xl border py-4 ${
            isDarkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-gray-50'
          }`}>
          <AntDesign name="google" size={20} color="#DB4437" />
          <Text className={isDarkMode ? 'text-white' : 'text-gray-900'}>Continue with Google</Text>
        </Pressable>
      </View>

      {/* Footer */}
      <Text
        className={`mt-8 text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        By signing in, you agree to our <Text className="text-blue-500">Terms of Service</Text> and{' '}
        <Text className="text-blue-500">Privacy Policy</Text>
      </Text>
    </View>
  );
}
