// app/auth/SignUpScreen.tsx
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { useTheme } from '~/lib/themeContext';
import { router } from 'expo-router';

export default function SignUpScreen() {
  const { isDarkMode } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    Alert.alert('Success', `Account created for ${name}!`);
    // Here you'd typically navigate to login or home
  };

  const handleGoogleSignUp = () => {
    Alert.alert('Google Sign-Up', 'Proceed with Google authentication');
  };

  return (
    <View className={`flex-1 justify-center px-6 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Title */}
      <Text
        className={`mb-2 text-center text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        Create Account
      </Text>
      <Text className={`mb-8 text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
        Join us today and get started!
      </Text>

      {/* Form */}
      <View className="gap-5">
        {/* Full Name */}
        <TextInput
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          className={`rounded-xl border px-5 py-4 ${
            isDarkMode
              ? 'border-gray-700 bg-gray-800 text-white'
              : 'border-gray-300 bg-gray-50 text-gray-900'
          }`}
        />

        {/* Email */}
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

        {/* Password */}
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

        {/* Confirm Password */}
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

        {/* Sign Up Button */}
        <Pressable
          onPress={handleSignUp}
          className="mt-2 rounded-xl bg-blue-600 py-4 active:bg-blue-700">
          <Text className="text-center font-medium text-white">Sign Up</Text>
        </Pressable>

        {/* OR Divider */}
        <View className="my-6 flex-row items-center">
          <View className="h-px flex-1 bg-gray-300 dark:bg-gray-700" />
          <Text className="px-4 text-gray-500 dark:text-gray-400">or</Text>
          <View className="h-px flex-1 bg-gray-300 dark:bg-gray-700" />
        </View>

        {/* Google Sign-Up Button */}
        <Pressable
          onPress={handleGoogleSignUp}
          className={`flex-row items-center justify-center gap-3 rounded-xl border py-4 ${
            isDarkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-gray-50'
          }`}>
          <AntDesign name="google" size={20} color="#DB4437" />
          <Text className={isDarkMode ? 'text-white' : 'text-gray-900'}>Sign Up with Google</Text>
        </Pressable>
      </View>

      {/* Footer */}
      <View className="mt-8">
        <Text className={`text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Already have an account?{' '}
          <Pressable onPress={() => router.push('/sign-in')}>
            <Text className="font-medium text-blue-500">Sign In</Text>
          </Pressable>
        </Text>

        <Text
          className={`mt-4 text-center text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          By signing up, you agree to our <Text className="text-blue-500">Terms</Text> and{' '}
          <Text className="text-blue-500">Privacy Policy</Text>
        </Text>
      </View>
    </View>
  );
}
