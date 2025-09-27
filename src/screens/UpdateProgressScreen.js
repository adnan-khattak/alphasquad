import React, { useState, useEffect } from 'react';
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

const UpdateProgressScreen = ({ navigation, route }) => {
  const { book } = route.params;
  const [pagesReadToday, setPagesReadToday] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentBook, setCurrentBook] = useState(book);

  useEffect(() => {
    // Refresh book data when screen focuses
    const loadCurrentBook = async () => {
      const updatedBook = await BookStorage.getBook(book.id);
      if (updatedBook) {
        setCurrentBook(updatedBook);
      }
    };

    const unsubscribe = navigation.addListener('focus', loadCurrentBook);
    return unsubscribe;
  }, [navigation, book.id]);

  const calculateProgress = (pagesRead, totalPages) => {
    if (totalPages === 0) return 0;
    return Math.round((pagesRead / totalPages) * 100);
  };

  const getProgressColor = (progress) => {
    if (progress >= 100) return COLORS.success;
    if (progress >= 75) return COLORS.warning;
    return COLORS.accent;
  };

  const handleUpdateProgress = async () => {
    // Validation
    if (!pagesReadToday.trim()) {
      Alert.alert('Error', 'Please enter the number of pages read today');
      return;
    }

    const pages = parseInt(pagesReadToday);
    if (isNaN(pages) || pages <= 0) {
      Alert.alert('Error', 'Please enter a valid number of pages');
      return;
    }

    const newTotalPagesRead = currentBook.pagesRead + pages;
    if (newTotalPagesRead > currentBook.totalPages) {
      Alert.alert(
        'Warning',
        `Adding ${pages} pages would exceed the total pages (${currentBook.totalPages}). Would you like to set it to ${currentBook.totalPages} pages?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Set to Maximum',
            onPress: async () => {
              await updateProgress(currentBook.totalPages - currentBook.pagesRead);
            },
          },
        ]
      );
      return;
    }

    await updateProgress(pages);
  };

  const updateProgress = async (pagesToAdd) => {
    setLoading(true);

    try {
      const updatedBook = await BookStorage.updateProgress(currentBook.id, pagesToAdd);
      
      if (updatedBook) {
        const newProgress = calculateProgress(updatedBook.pagesRead, updatedBook.totalPages);
        
        Alert.alert(
          'Progress Updated!',
          `Great job! You've read ${pagesToAdd} more pages. Total progress: ${newProgress}%`,
          [
            {
              text: 'Continue Reading',
              onPress: () => {
                setPagesReadToday('');
                setCurrentBook(updatedBook);
              },
            },
            {
              text: 'Done for Today',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to update progress. Please try again.');
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFinishBook = () => {
    Alert.alert(
      'Finish Book',
      `Mark "${currentBook.title}" as completed?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Mark as Complete',
          onPress: async () => {
            const remainingPages = currentBook.totalPages - currentBook.pagesRead;
            if (remainingPages > 0) {
              await updateProgress(remainingPages);
            }
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleCancel = () => {
    if (pagesReadToday.trim()) {
      Alert.alert(
        'Discard Changes',
        'Are you sure you want to discard your progress?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const progress = calculateProgress(currentBook.pagesRead, currentBook.totalPages);
  const progressColor = getProgressColor(progress);
  const remainingPages = currentBook.totalPages - currentBook.pagesRead;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Update Progress</Text>
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
          {/* Book Info */}
          <View style={styles.bookInfoCard}>
            <Text style={styles.bookTitle} numberOfLines={2}>
              {currentBook.title}
            </Text>
            <Text style={styles.bookPages}>
              {currentBook.pagesRead} / {currentBook.totalPages} pages
            </Text>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${progress}%`, backgroundColor: progressColor },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>{progress}%</Text>
            </View>

            {remainingPages > 0 && (
              <Text style={styles.remainingText}>
                {remainingPages} pages remaining
              </Text>
            )}

            {progress >= 100 && (
              <View style={styles.completedBadge}>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                <Text style={styles.completedText}>Completed!</Text>
              </View>
            )}
          </View>

          {/* Progress Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Pages Read Today</Text>
            <TextInput
              style={styles.input}
              value={pagesReadToday}
              onChangeText={setPagesReadToday}
              placeholder="Enter pages read today"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="numeric"
              returnKeyType="done"
              maxLength={6}
              autoFocus
            />
            <Text style={styles.helperText}>
              How many pages did you read today?
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.updateButton, loading && styles.disabledButton]}
              onPress={handleUpdateProgress}
              disabled={loading}
            >
              {loading ? (
                <Text style={styles.updateButtonText}>Updating...</Text>
              ) : (
                <>
                  <Ionicons name="checkmark" size={20} color={COLORS.background} />
                  <Text style={styles.updateButtonText}>Update Progress</Text>
                </>
              )}
            </TouchableOpacity>

            {remainingPages > 0 && (
              <TouchableOpacity
                style={styles.finishButton}
                onPress={handleFinishBook}
                disabled={loading}
              >
                <Ionicons name="flag" size={20} color={COLORS.accent} />
                <Text style={styles.finishButtonText}>Mark as Complete</Text>
              </TouchableOpacity>
            )}

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
  bookInfoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.textMuted,
  },
  bookTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  bookPages: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.textMuted,
    borderRadius: 4,
    marginRight: SPACING.md,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
    minWidth: 40,
    textAlign: 'right',
  },
  remainingText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.md,
  },
  completedText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.success,
    marginLeft: SPACING.sm,
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
    textAlign: 'center',
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
  },
  helperText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  buttonContainer: {
    marginTop: 'auto',
    paddingBottom: SPACING.xl,
  },
  updateButton: {
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
  updateButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.background,
    marginLeft: SPACING.sm,
  },
  finishButton: {
    backgroundColor: 'transparent',
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.accent,
    marginBottom: SPACING.md,
  },
  finishButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.accent,
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

export default UpdateProgressScreen;
