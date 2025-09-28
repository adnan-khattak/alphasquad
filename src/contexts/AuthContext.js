import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../config/supabase';
import { Alert } from 'react-native';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sign up with email and password
  const signUp = async (email, password, fullName) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        Alert.alert('Sign Up Error', error.message);
        return { success: false, error: error.message };
      }

      if (data.user && !data.session) {
        Alert.alert(
          'Check your email',
          'We sent you a confirmation link. Please check your email and click the link to verify your account.'
        );
      }

      return { success: true, data };
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email and password
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        Alert.alert('Sign In Error', error.message);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        Alert.alert('Sign Out Error', error.message);
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'your-app://reset-password', // You'll need to handle this
      });

      if (error) {
        Alert.alert('Reset Password Error', error.message);
        return { success: false, error: error.message };
      }

      Alert.alert(
        'Password Reset Email Sent',
        'Check your email for instructions to reset your password.'
      );
      return { success: true };
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
