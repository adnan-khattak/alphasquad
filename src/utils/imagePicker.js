import * as ImagePicker from 'expo-image-picker';

export const ImagePickerService = {
  // Request camera and media library permissions
  async requestPermissions() {
    try {
      // Request camera permissions
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      
      // Request media library permissions
      const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      return {
        camera: cameraPermission.status === 'granted',
        mediaLibrary: mediaLibraryPermission.status === 'granted',
      };
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return {
        camera: false,
        mediaLibrary: false,
      };
    }
  },

  // Pick image from gallery
  async pickImageFromGallery() {
    try {
      const permissions = await this.requestPermissions();
      
      if (!permissions.mediaLibrary) {
        throw new Error('Media library permission not granted');
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4], // Book cover aspect ratio
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        return {
          success: true,
          uri: result.assets[0].uri,
          width: result.assets[0].width,
          height: result.assets[0].height,
        };
      }

      return {
        success: false,
        uri: null,
      };
    } catch (error) {
      console.error('Error picking image from gallery:', error);
      return {
        success: false,
        uri: null,
        error: error.message,
      };
    }
  },

  // Take photo with camera
  async takePhoto() {
    try {
      const permissions = await this.requestPermissions();
      
      if (!permissions.camera) {
        throw new Error('Camera permission not granted');
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [3, 4], // Book cover aspect ratio
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        return {
          success: true,
          uri: result.assets[0].uri,
          width: result.assets[0].width,
          height: result.assets[0].height,
        };
      }

      return {
        success: false,
        uri: null,
      };
    } catch (error) {
      console.error('Error taking photo:', error);
      return {
        success: false,
        uri: null,
        error: error.message,
      };
    }
  },

  // Show image picker options
  async showImagePickerOptions() {
    return new Promise((resolve) => {
      // This would typically show a modal or action sheet
      // For now, we'll return the options and let the UI handle the selection
      resolve({
        options: [
          { title: 'Take Photo', action: 'camera' },
          { title: 'Choose from Gallery', action: 'gallery' },
          { title: 'Cancel', action: 'cancel' },
        ],
      });
    });
  },

  // Validate image size and format
  validateImage(uri, maxSizeMB = 5) {
    return new Promise((resolve) => {
      // For React Native, we can't easily get file size without additional libraries
      // This is a basic validation - in a real app you might want to use react-native-fs
      const validExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
      const extension = uri.toLowerCase().substring(uri.lastIndexOf('.'));
      
      if (!validExtensions.includes(extension)) {
        resolve({
          valid: false,
          error: 'Invalid image format. Please use JPG, PNG, or GIF.',
        });
        return;
      }

      resolve({
        valid: true,
      });
    });
  },

  // Resize image (placeholder - would need react-native-image-resizer in a real app)
  async resizeImage(uri, maxWidth = 400, maxHeight = 600) {
    try {
      // In a real app, you would use react-native-image-resizer here
      // For now, we'll return the original URI
      return {
        success: true,
        uri: uri,
        width: maxWidth,
        height: maxHeight,
      };
    } catch (error) {
      console.error('Error resizing image:', error);
      return {
        success: false,
        uri: null,
        error: error.message,
      };
    }
  }
};
