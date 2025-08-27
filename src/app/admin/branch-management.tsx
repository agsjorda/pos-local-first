import { View, Text, Pressable, TextInput, Alert, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTheme } from '../../contexts/themeContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '~/contexts/authContext';
import { createBranch, getBranches, assignUserToBranch } from '~/services/branchService';
import { Branch } from '~/types';

const BranchManagementScreen = () => {
  const { isDarkMode } = useTheme();
  const { profile, loading } = useAuth();
  const router = useRouter();
  const [branchName, setBranchName] = useState('');
  const [branchAddress, setBranchAddress] = useState('');
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loadingBranches, setLoadingBranches] = useState(false);

  useEffect(() => {
    if (!loading && (!profile || profile.role !== 'admin')) {
      router.replace('/');
    }
  }, [profile, loading, router]);

  const loadBranches = async () => {
    setLoadingBranches(true);
    try {
      const data = await getBranches();
      if (Array.isArray(data)) {
        setBranches(data);
      } else {
        setBranches([]);
      }
    } catch (e) {
      setBranches([]);
    } finally {
      setLoadingBranches(false);
    }
  };

  useEffect(() => {
    loadBranches();
  }, []);

  const handleCreateBranch = async () => {
    if (!branchName.trim() || !branchAddress.trim()) {
      Alert.alert('Validation', 'Branch name and address are required');
      return;
    }
    try {
      await createBranch({ name: branchName.trim(), address: branchAddress.trim() });
      setBranchName('');
      setBranchAddress('');
      loadBranches();
      Alert.alert('Success', 'Branch created');
    } catch (e) {
      Alert.alert('Error', 'Failed to create branch');
    }
  };

  if (loading || !profile || profile.role !== 'admin') {
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        className={`flex-1 px-5 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
        data={branches}
        keyExtractor={item => item.id}
        refreshing={loadingBranches}
        onRefresh={loadBranches}
        ListHeaderComponent={
          <View className="py-6">
            <Text className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} text-center mb-2`}>Branch Management</Text>
            <Text className={`text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-center mb-8`}>Create and manage branches</Text>
            <View className={`${isDarkMode ? 'bg-yellow-900/30' : 'bg-yellow-50'} rounded-xl p-5 mb-4 shadow-sm`}>
              <Text className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Create Branch</Text>
              <View className="mb-3 gap-2">
                <TextInput
                  placeholder="New Branch Name"
                  value={branchName}
                  onChangeText={setBranchName}
                  className={`rounded-lg px-4 py-2 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} border ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}
                  placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
                  style={{ marginBottom: 8 }}
                />
                <TextInput
                  placeholder="Branch Address"
                  value={branchAddress}
                  onChangeText={setBranchAddress}
                  className={`rounded-lg px-4 py-2 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} border ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}
                  placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
                  style={{ marginBottom: 8 }}
                />
                <Pressable
                  onPress={handleCreateBranch}
                  className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-yellow-600' : 'bg-yellow-400'}`}
                >
                  <Text className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Create</Text>
                </Pressable>
              </View>
              <Text className={`mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Existing Branches:</Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View className={`flex-row items-center py-2 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <FontAwesome name="building" size={18} color="#eab308" className="mr-2" />
            <Text className={`text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.name}</Text>
          </View>
        )}
        ListEmptyComponent={<Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No branches found.</Text>}
        contentContainerStyle={{ paddingBottom: 32 }}
      />
    </SafeAreaView>
  );
};

export default BranchManagementScreen;
