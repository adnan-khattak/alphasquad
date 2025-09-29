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
  // SafeAreaView,
  Image,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '../constants/dimensions';
import { BookService, BOOK_CATEGORIES } from '../utils/bookService';
import { ImagePickerService } from '../utils/imagePicker';

const AddBookScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const [title, setTitle] = useState('');
  const [totalPages, setTotalPages] = useState('');
  const [category, setCategory] = useState('Other');
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

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
      const newBook = await BookService.addBook({
        title: title.trim(),
        totalPages: pages,
        category: category,
        coverImage: coverImage,
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
      const message = (error && error.message) ? error.message : 'An unexpected error occurred. Please try again.';
      Alert.alert('Error adding book', message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (title.trim() || totalPages.trim() || coverImage) {
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

  const handleImagePicker = () => {
    Alert.alert(
      'Add Book Cover',
      'Choose how you want to add a book cover',
      [
        { text: 'Take Photo', onPress: () => takePhoto() },
        { text: 'Choose from Gallery', onPress: () => pickFromGallery() },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePickerService.takePhoto();
      if (result.success) {
        setCoverImage(result.uri);
      } else if (result.error) {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const pickFromGallery = async () => {
    try {
      const result = await ImagePickerService.pickImageFromGallery();
      if (result.success) {
        setCoverImage(result.uri);
      } else if (result.error) {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image from gallery');
    }
  };

  const removeCoverImage = () => {
    setCoverImage(null);
  };

  const selectCategory = (selectedCategory) => {
    setCategory(selectedCategory);
    setShowCategoryModal(false);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
  
    /* Header */
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: SPACING.lg,
      paddingTop: SPACING.lg,
      paddingBottom: SPACING.md,
    },
    backButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: FONT_SIZES.lg,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    placeholder: { width: 36 },
  
    /* Content */
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.md,
    },
    formContainer: { marginBottom: SPACING.lg },
    inputGroup: { marginBottom: SPACING.lg },
  
    label: {
      fontSize: FONT_SIZES.md,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: SPACING.sm,
    },
    helperText: {
      fontSize: FONT_SIZES.sm,
      fontWeight: '500',
      color: colors.textPrimary,
      marginBottom: SPACING.sm,
    },
    input: {
      backgroundColor: colors.surface,
      borderRadius: BORDER_RADIUS.md,
      paddingVertical: SPACING.md,
      paddingHorizontal: SPACING.md,
      fontSize: FONT_SIZES.md,
      color: colors.textPrimary,
      fontWeight: '500',
    },
    characterCount: {
      fontSize: FONT_SIZES.xs,
      color: colors.textMuted,
      textAlign: 'right',
      marginTop: SPACING.xs,
    },
  
    /* Category Selector */
    categorySelector: {
      backgroundColor: colors.surface,
      borderRadius: BORDER_RADIUS.md,
      paddingVertical: SPACING.md,
      paddingHorizontal: SPACING.md,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    categoryText: {
      fontSize: FONT_SIZES.md,
      color: colors.textPrimary,
      fontWeight: '500',
    },
  
    /* Cover Image */
    coverImageContainer: { alignItems: 'center', marginBottom: SPACING.md },
    coverImage: {
      width: 110,
      height: 150,
      borderRadius: BORDER_RADIUS.md,
      backgroundColor: colors.surface,
    },
    imagePlaceholder: {
      width: 110,
      height: 150,
      borderRadius: BORDER_RADIUS.md,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.textMuted,
      borderStyle: 'dashed',
      justifyContent: 'center',
      alignItems: 'center',
    },
    imagePlaceholderText: {
      fontSize: FONT_SIZES.xs,
      color: colors.textMuted,
      marginTop: SPACING.xs,
    },
    addImageButton: {
      backgroundColor: colors.accent,
      borderRadius: BORDER_RADIUS.md,
      paddingVertical: SPACING.sm,
      paddingHorizontal: SPACING.lg,
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: SPACING.sm,
    },
    addImageButtonText: {
      fontSize: FONT_SIZES.sm,
      fontWeight: '600',
      color: colors.background,
      marginLeft: SPACING.xs,
    },
    removeImageButton: {
      backgroundColor: colors.error,
      borderRadius: BORDER_RADIUS.sm,
      paddingVertical: SPACING.xs,
      paddingHorizontal: SPACING.sm,
      marginTop: SPACING.sm,
    },
    removeImageButtonText: {
      fontSize: FONT_SIZES.xs,
      fontWeight: '600',
      color: colors.white,
    },
  
    /* Buttons */
    buttonContainer: {
      marginTop: 'auto',
      paddingBottom: SPACING.lg,
    },
    saveButton: {
      backgroundColor: colors.accent,
      borderRadius: BORDER_RADIUS.md,
      paddingVertical: SPACING.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: SPACING.md,
    },
    disabledButton: { opacity: 0.6 },
    saveButtonText: {
      fontSize: FONT_SIZES.md,
      fontWeight: '600',
      color: colors.background,
      marginLeft: SPACING.xs,
    },
    cancelButton: {
      borderRadius: BORDER_RADIUS.md,
      paddingVertical: SPACING.md,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.textMuted,
    },
    cancelButtonText: {
      fontSize: FONT_SIZES.md,
      fontWeight: '600',
      color: colors.textSecondary,
    },
  
    /* Modal */
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: BORDER_RADIUS.lg,
      borderTopRightRadius: BORDER_RADIUS.lg,
      paddingTop: SPACING.md,
      paddingBottom: SPACING.lg,
      maxHeight: '70%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: SPACING.lg,
      paddingBottom: SPACING.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.textMuted,
    },
    modalTitle: {
      fontSize: FONT_SIZES.md,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    categoryList: { paddingHorizontal: SPACING.lg },
    categoryItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: SPACING.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.textMuted,
    },
    categoryItemText: {
      fontSize: FONT_SIZES.md,
      color: colors.textPrimary,
      flex: 1,
    },
    selectedCategory: { color: colors.accent, fontWeight: '600' },
  });
  

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
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
            {/* Book Cover */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Book Cover (Optional)</Text>
              <View style={styles.coverImageContainer}>
                {coverImage ? (
                  <>
                    <Image source={{ uri: coverImage }} style={styles.coverImage} />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={removeCoverImage}
                    >
                      <Text style={styles.removeImageButtonText}>Remove</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <View style={styles.imagePlaceholder}>
                      <Ionicons name="book-outline" size={32} color={colors.textMuted} />
                      <Text style={styles.imagePlaceholderText}>No cover image</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.addImageButton}
                      onPress={handleImagePicker}
                    >
                      <Ionicons name="camera" size={16} color={colors.background} />
                      <Text style={styles.addImageButtonText}>Add Cover</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Book Title</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Enter book title"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="words"
                autoCorrect={true}
                returnKeyType="next"
                maxLength={100}
              />
              <Text style={styles.characterCount}>{title.length}/100</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category</Text>
              <TouchableOpacity
                style={styles.categorySelector}
                onPress={() => setShowCategoryModal(true)}
              >
                <Text style={styles.categoryText}>{category}</Text>
                <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Total Pages</Text>
              <TextInput
                style={styles.input}
                value={totalPages}
                onChangeText={setTotalPages}
                placeholder="Enter total number of pages"
                placeholderTextColor={colors.textMuted}
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
                  <Ionicons name="checkmark" size={20} color={colors.background} />
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

      {/* Category Selection Modal */}
      <Modal
        visible={showCategoryModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalContainer}
            activeOpacity={1}
            onPress={() => setShowCategoryModal(false)}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowCategoryModal(false)}
              >
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={BOOK_CATEGORIES}
              keyExtractor={(item) => item}
              style={styles.categoryList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.categoryItem}
                  onPress={() => selectCategory(item)}
                >
                  <Text
                    style={[
                      styles.categoryItemText,
                      category === item && styles.selectedCategory,
                    ]}
                  >
                    {item}
                  </Text>
                  {category === item && (
                    <Ionicons name="checkmark" size={20} color={colors.accent} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AddBookScreen;
