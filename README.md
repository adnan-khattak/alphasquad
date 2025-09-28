# AlphaSquaad - Reading Tracker (Phase 2)

A modern React Native application built with Expo for tracking your reading progress. Transform your reading habits with a comprehensive tracking system, beautiful analytics, and smart notifications.

## 🚀 Features

### Core Features
- **Book Library**: Track multiple books with progress visualization
- **Progress Tracking**: Update daily reading progress with visual feedback
- **Local Storage**: Persistent data storage using AsyncStorage
- **Reading Streaks**: Track consecutive days of reading
- **Categories & Tags**: Organize books by genre/category

### Advanced Features
- **Daily Reminders**: Smart notifications to maintain reading habits
- **Analytics Dashboard**: Beautiful charts showing reading patterns
- **Book Covers**: Upload and display book cover images
- **Search & Filter**: Find books quickly by title or category
- **Theme Toggle**: Switch between light and dark modes
- **Smooth Animations**: Polished UI with animated transitions

### Technical Features
- **AsyncStorage**: Persistent local data storage
- **Expo Notifications**: Daily reminder system
- **React Native Charts**: Beautiful data visualization
- **Image Picker**: Book cover upload functionality
- **Theme Context**: Dynamic theme management
- **Responsive Design**: Optimized for all screen sizes

## 📱 Screens

1. **Book List Screen** (`src/screens/BookListScreen.js`)
   - Display all books with progress bars and completion percentages
   - Reading streak display in header
   - Search bar for filtering books by title
   - Category filter with modal selection
   - Floating action button to add new books
   - Update progress buttons for each book
   - Delete book functionality
   - Theme toggle and settings access

2. **Add Book Screen** (`src/screens/AddBookScreen.js`)
   - Form to add new books (title, category, total pages)
   - Optional book cover image upload (camera or gallery)
   - Category selection with modal picker
   - Form validation and error handling
   - Auto-save to local storage

3. **Update Progress Screen** (`src/screens/UpdateProgressScreen.js`)
   - Input pages read today
   - Visual progress tracking with completion status
   - Mark books as complete functionality
   - Smart validation (prevents exceeding total pages)

4. **Stats Screen** (`src/screens/StatsScreen.js`)
   - Reading streak display with motivational messages
   - Weekly reading statistics
   - Beautiful bar chart showing last 7 days
   - Average pages per day calculation
   - Total pages read this week

5. **Settings Screen** (`src/screens/SettingsScreen.js`)
   - Theme toggle (light/dark mode)
   - Notification settings and permissions
   - Test notification functionality
   - App version information

## 🏗️ Project Structure

```
src/
├── screens/           # All screen components
│   ├── BookListScreen.js
│   ├── AddBookScreen.js
│   ├── UpdateProgressScreen.js
│   ├── StatsScreen.js
│   └── SettingsScreen.js
├── navigation/        # Navigation configuration
│   └── AppNavigator.js
├── components/        # Reusable UI components
│   ├── AnimatedButton.js
│   └── AnimatedProgressBar.js
├── contexts/          # React contexts
│   └── ThemeContext.js
├── constants/         # App constants and themes
│   ├── colors.js
│   └── dimensions.js
├── utils/            # Utility functions
│   ├── bookStorage.js     # AsyncStorage operations
│   ├── notificationService.js # Notification management
│   ├── themeService.js    # Theme management
│   └── imagePicker.js     # Image upload functionality
├── assets/           # Static assets
└── index.js          # Export file for easy imports
```

## 🎨 Design System

### Colors
- **Primary**: Black (`#000000`)
- **Secondary**: Dark gray (`#1a1a1a`)
- **Accent**: White (`#ffffff`)
- **Success**: Green (`#00ff88`)
- **Warning**: Orange (`#ffaa00`)
- **Error**: Red (`#ff3366`)

### Typography
- Consistent font sizing with semantic naming
- Clean, readable typography
- Minimalist design approach

## 🛠️ Dependencies

- **Expo**: Development platform
- **React Navigation**: Screen navigation
- **AsyncStorage**: Local data persistence
- **Expo Notifications**: Daily reminder system
- **Expo Image Picker**: Book cover upload functionality
- **React Native Chart Kit**: Beautiful data visualization
- **React Native SVG**: Chart rendering support
- **Expo Vector Icons**: Icon library
- **React Native Safe Area Context**: Safe area handling

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm start
   ```

3. **Run on device/simulator**:
   ```bash
   npm run android  # Android
   npm run ios      # iOS
   npm run web      # Web
   ```

## 📱 Navigation Flow

```
Book List Screen (Home) → Add Book Screen → Back to Book List
     ↓                        ↓
Update Progress Screen → Back to Book List
     ↓
Stats Screen ← → Settings Screen
```

## 🎯 Key Features

### Data Management
- **Local Storage**: All data persisted using AsyncStorage
- **Reading History**: Track daily reading patterns
- **Streak Tracking**: Monitor consecutive reading days
- **Category System**: Organize books by genre

### User Experience
- **Progress Tracking**: Visual progress bars and completion percentages
- **Search & Filter**: Find books quickly by title or category
- **Theme Support**: Light and dark mode with persistent preferences
- **Smooth Animations**: Polished UI with animated transitions

### Smart Features
- **Daily Notifications**: Remind users to read at 8 PM daily
- **Analytics Dashboard**: Beautiful charts showing reading patterns
- **Book Covers**: Visual book identification with image uploads
- **Form Validation**: Comprehensive input validation and error handling

### Technical Excellence
- **State Management**: React hooks and context for state management
- **Responsive Layout**: Adapts to different screen sizes
- **Error Handling**: Robust error handling throughout the app
- **Performance**: Optimized for smooth user experience

## 🔧 Customization

### Adding New Features
1. Create screen component in `src/screens/`
2. Add to navigation stack in `src/navigation/AppNavigator.js`
3. Update storage utilities in `src/utils/bookStorage.js` if needed

### Modifying Theme
- Update `src/constants/colors.js` for color changes
- Modify `src/constants/dimensions.js` for spacing/sizing
- All components automatically inherit theme changes

### Data Management
- All book data is stored locally using AsyncStorage
- Data persists between app sessions
- Use `BookStorage` utility for all data operations

## 📄 License

This project is created for educational purposes. Feel free to modify and use as needed.
