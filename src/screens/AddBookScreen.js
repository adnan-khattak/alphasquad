import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '../constants/dimensions';
import { BookStorage } from '../utils/bookStorage';

const AddBookScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [totalPages, setTotalPages] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSaveBook = async () => {
    // Validation
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a book title');
      return;
    }

    if (!totalPages.trim()) {
      Alert.alert('Error', 'Please enter the total number of pages');
      return;
    }

    const pages = parseInt(totalPages);
    if (isNaN(pages) || pages <= 0) {
      Alert.alert('Error', 'Please enter a valid number of pages');
      return;
    }

    setLoading(true);

    try {
      const newBook = await BookStorage.addBook({
        title: title.trim(),
        totalPages: pages,
      });

      if (newBook) {
        Alert.alert(
          'Success',
          'Book added successfully!',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to save book. Please try again.');
      }
    } catch (error) {
      console.error('Error adding book:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (title.trim() || totalPages.trim()) {
      Alert.alert(
        'Discard Changes',
        'Are you sure you want to discard your changes?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Book</Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Book Title</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Enter book title"
                placeholderTextColor={COLORS.textMuted}
                autoCapitalize="words"
                autoCorrect={true}
                returnKeyType="next"
                maxLength={100}
              />
              <Text style={styles.characterCount}>{title.length}/100</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Total Pages</Text>
              <TextInput
                style={styles.input}
                value={totalPages}
                onChangeText={setTotalPages}
                placeholder="Enter total number of pages"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="numeric"
                returnKeyType="done"
                maxLength={6}
              />
              <Text style={styles.helperText}>
                Enter the total number of pages in the book
              </Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.saveButton, loading && styles.disabledButton]}
              onPress={handleSaveBook}
              disabled={loading}
            >
              {loading ? (
                <Text style={styles.saveButtonText}>Saving...</Text>
              ) : (
                <>
                  <Ionicons name="checkmark" size={20} color={COLORS.background} />
                  <Text style={styles.saveButtonText}>Add Book</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.textMuted,
  },
  backButton: {
    padding: SPACING.sm,
    marginLeft: -SPACING.sm,
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  placeholder: {
    width: 40,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
  },
  formContainer: {
    marginBottom: SPACING.xl,
  },
  inputGroup: {
    marginBottom: SPACING.xl,
  },
  label: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.textMuted,
  },
  characterCount: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    textAlign: 'right',
    marginTop: SPACING.xs,
  },
  helperText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  buttonContainer: {
    marginTop: 'auto',
    paddingBottom: SPACING.xl,
  },
  saveButton: {
    backgroundColor: COLORS.accent,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  disabledButton: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.background,
    marginLeft: SPACING.sm,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.textMuted,
  },
  cancelButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
});

export default AddBookScreen;
