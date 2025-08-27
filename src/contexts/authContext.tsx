import { createContext, useContext, useEffect, useState } from 'react';
import { makeRedirectUri } from 'expo-auth-session';
import { supabase } from '../services/supabase';
import { Session, User } from '@supabase/supabase-js';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { Profile } from '../types/profile';
import { syncService } from '../services/syncService';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  isOnline: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  syncProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);

  // Initialize database and check online status
  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        await syncService.ensureInitialized();
        const netInfo = await NetInfo.fetch();
        if (mounted) {
          setIsOnline(netInfo.isConnected ?? false);
          if (netInfo.isConnected) {
            await syncService.startSync();
          }
        }
      } catch (error) {
        console.error('Initialization error:', error);
      }
    };

    const unsubscribe = NetInfo.addEventListener(async (state) => {
      if (mounted) {
        setIsOnline(state.isConnected ?? false);
        if (state.isConnected) {
          await syncService.startSync();
        } else {
          syncService.stopSync();
        }
      }
    });

    initialize();

    return () => {
      mounted = false;
      unsubscribe();
      syncService.stopSync();
    };
  }, []);

  // Load cached profile
  useEffect(() => {
    const loadCachedProfile = async () => {
      try {
        const cachedProfile = await AsyncStorage.getItem('cached_profile');
        if (cachedProfile) {
          setProfile(JSON.parse(cachedProfile));
        }
      } catch (error) {
        console.error('Error loading cached profile:', error);
      }
    };
    loadCachedProfile();
  }, []);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
      if (!mounted) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        fetchProfile(data.session.user.id);
      } else {
        setLoading(false);
      }
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: string, session: Session | null) => {
      if (!mounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
        handleNavigation(profile?.role);
      } else {
        setProfile(null);
        setLoading(false);
        await AsyncStorage.removeItem('cached_profile');
        if (event === 'SIGNED_OUT') {
          router.replace('/sign-in');
        }
      }
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleNavigation = (role?: string) => {
    if (role === 'admin') {
      router.replace('/(drawer)/admin');
    } else if (role === 'manager') {
      router.replace('/(drawer)/(tabs)');
    } else {
      router.replace('/(drawer)/(tabs)');
    }
  };

  const fetchProfile = async (userId: string) => {
    try {
      if (isOnline) {
        await syncService.syncData();
      }
      const profile = await syncService.getProfile(userId);
      if (profile) {
        setProfile(profile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    // 1. Sign up the user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });
    if (signUpError) {
      throw signUpError;
    }

    // 2. Wait for user to be available
    const user = signUpData.user;
    if (!user) {
      throw new Error('User not returned after sign up');
    }

    // 3. Check if this is the first user (no profiles exist)
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    if (profilesError) {
      throw profilesError;
    }
    const isFirstUser = !profiles || profiles.length === 0;
    const role = isFirstUser ? 'admin' : 'user';

    // 4. Upsert profile in Supabase
    const { error: upsertError } = await supabase.from('profiles').upsert({
      id: user.id,
      email: user.email,
      name,
      role,
    });
    if (upsertError) {
      throw upsertError;
    }
    // 5. Upsert profile locally (optional, will be synced anyway)
    await syncService.ensureInitialized();
    await syncService.getDatabase().runSync(
      `INSERT OR REPLACE INTO profiles (id, email, name, role, is_synced) VALUES (?, ?, ?, ?, 1);`,
      [user.id, user.email ?? '', name, role]
    );
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  };

  const syncProfile = async () => {
    if (!user || !isOnline) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (error) {
        throw error;
      }
      if (data) {
        const profileWithSync = {
          ...(data as Profile),
          synced_at: new Date().toISOString(),
        };
        setProfile(profileWithSync);
        await AsyncStorage.setItem('cached_profile', JSON.stringify(profileWithSync));
      }
    } catch (error) {
      console.error('Error syncing profile:', error);
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    isOnline,
    signIn,
    signUp,
    signOut,
    syncProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// The following useAuth function is the correct implementation

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
