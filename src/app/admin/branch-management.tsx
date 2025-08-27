import { View, Text, Pressable, TextInput, Alert, FlatList, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTheme } from '../../contexts/themeContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '~/contexts/authContext';
import { createBranch, getBranches, assignUserToBranch } from '~/services/branchService';
import { deleteBranch, updateBranch } from '~/services/branchEditService';
import { deleteLocalBranch, updateLocalBranch } from '~/services/localBranch';
import { Branch } from '~/types';

const BranchManagementScreen = () => {
  const { isDarkMode } = useTheme();
  const { profile, loading } = useAuth();
  const router = useRouter();
  const [branchName, setBranchName] = useState('');
  const [branchAddress, setBranchAddress] = useState('');
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editBranch, setEditBranch] = useState<Branch | null>(null);

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

  const handleCreateOrEditBranch = async () => {
    if (!branchName.trim() || !branchAddress.trim()) {
      Alert.alert('Validation', 'Branch name and address are required');
      return;
    }
    try {
      if (editBranch) {
        // Edit branch
        const updated = await updateBranch(editBranch.id, { name: branchName.trim(), address: branchAddress.trim() });
        await updateLocalBranch(editBranch.id, { name: branchName.trim(), address: branchAddress.trim(), updated_at: new Date().toISOString() });
        setBranches(prev => prev.map(b => b.id === editBranch.id ? { ...b, ...updated } : b));
        setEditBranch(null);
        Alert.alert('Success', 'Branch updated');
      } else {
        // Create branch
        const newBranch = await createBranch({ name: branchName.trim(), address: branchAddress.trim() });
        setBranches(prev => [newBranch, ...prev]);
        Alert.alert('Success', 'Branch created');
      }
      setBranchName('');
      setBranchAddress('');
      setShowModal(false);
    } catch (e: any) {
      console.error('Branch create/edit error:', e);
      Alert.alert('Error', `Failed to save branch: ${e?.message || e?.toString() || 'Unknown error'}`);
    }
  };

  const handleDeleteBranch = async (branch: Branch) => {
    Alert.alert('Delete Branch', `Are you sure you want to delete "${branch.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          try {
            await deleteBranch(branch.id);
            await deleteLocalBranch(branch.id);
            setBranches(prev => prev.filter(b => b.id !== branch.id));
            Alert.alert('Deleted', 'Branch deleted');
          } catch (e: any) {
            Alert.alert('Error', `Failed to delete branch: ${e?.message || e?.toString() || 'Unknown error'}`);
          }
        }
      }
    ]);
  };

  const openEditModal = (branch: Branch) => {
    setEditBranch(branch);
    setBranchName(branch.name);
    setBranchAddress(branch.address);
    setShowModal(true);
  };

  if (loading || !profile || profile.role !== 'admin') {
    return null;
  }

  // Filter branches by search
  const filteredBranches = search.trim()
    ? branches.filter(b => b.name.toLowerCase().includes(search.trim().toLowerCase()))
    : branches;

  return (
    <SafeAreaView style={{ flex: 1 }}>


      {/* Modal for Add Branch */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent
        onRequestClose={() => {
          setShowModal(false);
          setEditBranch(null);
          setBranchName('');
          setBranchAddress('');
        }}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: isDarkMode ? '#1f2937' : '#fff', borderRadius: 16, padding: 24, width: '90%' }}>
            <Text className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{editBranch ? 'Edit Branch' : 'Add Branch'}</Text>
            <TextInput
              placeholder="Branch Name"
              value={branchName}
              onChangeText={setBranchName}
              className={`rounded-lg px-4 py-2 mb-3 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} border ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}
              placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
            />
            <TextInput
              placeholder="Branch Address"
              value={branchAddress}
              onChangeText={setBranchAddress}
              className={`rounded-lg px-4 py-2 mb-3 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} border ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}
              placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
              <Pressable
                onPress={() => {
                  setShowModal(false);
                  setEditBranch(null);
                  setBranchName('');
                  setBranchAddress('');
                }}
                style={{ paddingVertical: 10, paddingHorizontal: 18, borderRadius: 8, backgroundColor: isDarkMode ? '#374151' : '#e5e7eb', marginRight: 8 }}
              >
                <Text className={isDarkMode ? 'text-white' : 'text-gray-900'}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleCreateOrEditBranch}
                style={{ paddingVertical: 10, paddingHorizontal: 18, borderRadius: 8, backgroundColor: isDarkMode ? '#eab308' : '#fde047' }}
              >
                <Text className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{editBranch ? 'Save' : 'Create'}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Branches List */}
      <FlatList
        className={`flex-1 px-5 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
        data={filteredBranches}
        keyExtractor={item => item.id}
        refreshing={loadingBranches}
        onRefresh={loadBranches}
        ListHeaderComponent={
          <View className="py-6">
            <Text className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} text-center mb-2`}>Branch Management</Text>
            <Text className={`text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-center mb-8`}>Create and manage branches</Text>
            {/* Search and Add */}
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 0, marginTop: 0, marginBottom: 8 }}>
              <TextInput
                placeholder="Search branches..."
                value={search}
                onChangeText={setSearch}
                className={`flex-1 rounded-lg px-4 py-2 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} border ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}
                placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
              />
              <Pressable
                onPress={() => setShowModal(true)}
                style={{ marginLeft: 10, backgroundColor: isDarkMode ? '#eab308' : '#fde047', borderRadius: 8, padding: 10 }}
              >
                <FontAwesome name="plus" size={20} color={isDarkMode ? '#fff' : '#a16207'} />
              </Pressable>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View className={`flex-row items-center py-2 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <FontAwesome name="building" size={18} color="#eab308" className="mr-2" />
            <Text className={`flex-1 text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.name}</Text>
            <Pressable
              onPress={() => openEditModal(item)}
              style={{ marginRight: 12, padding: 6, borderRadius: 6, backgroundColor: isDarkMode ? '#334155' : '#f3f4f6' }}
            >
              <FontAwesome name="edit" size={18} color={isDarkMode ? '#fde047' : '#a16207'} />
            </Pressable>
            <Pressable
              onPress={() => handleDeleteBranch(item)}
              style={{ padding: 6, borderRadius: 6, backgroundColor: isDarkMode ? '#7f1d1d' : '#fee2e2' }}
            >
              <FontAwesome name="trash" size={18} color={isDarkMode ? '#f87171' : '#b91c1c'} />
            </Pressable>
          </View>
        )}
        ListEmptyComponent={<Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No branches found.</Text>}
        contentContainerStyle={{ paddingBottom: 32 }}
      />
    </SafeAreaView>
  );
};

export default BranchManagementScreen;
