# Supabase Setup Instructions

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Fill in your project details:
   - **Name**: Reading Tracker (or your preferred name)
   - **Database Password**: Choose a strong password
   - **Region**: Select the closest region to your users
5. Click "Create new project"

## 2. Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL**
   - **Project API Keys** → **anon public** key

## 3. Configure Your App

1. Open `src/config/supabase.js`
2. Replace the placeholder values:

```javascript
const supabaseUrl = 'YOUR_SUPABASE_URL'; // Replace with your Project URL
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'; // Replace with your anon key
```

Example:
```javascript
const supabaseUrl = 'https://your-project-id.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

## 4. Configure Authentication Settings

1. In your Supabase dashboard, go to **Authentication** → **Settings**
2. Configure the following settings:

### General Settings
- **Site URL**: For development, use `exp://localhost:8081` or your Expo dev URL
- **Redirect URLs**: Add your app's redirect URLs

### Email Settings
- **Enable email confirmations**: Toggle ON for production
- **Enable email change confirmations**: Toggle ON for production

### Password Settings
- **Minimum password length**: 6 (or your preference)
- **Require uppercase, lowercase, and numbers**: Toggle ON for better security

## 5. Database Schema (Optional)

If you want to store user-specific book data in Supabase instead of local storage, you can create the following tables:

### Books Table
```sql
CREATE TABLE books (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  total_pages INTEGER NOT NULL,
  pages_read INTEGER DEFAULT 0,
  category TEXT DEFAULT 'General',
  cover_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- Create policy for users to only see their own books
CREATE POLICY "Users can view own books" ON books
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own books" ON books
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own books" ON books
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own books" ON books
  FOR DELETE USING (auth.uid() = user_id);
```

### Reading History Table
```sql
CREATE TABLE reading_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  pages_read INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE reading_history ENABLE ROW LEVEL SECURITY;

-- Create policy for users to only see their own reading history
CREATE POLICY "Users can view own reading history" ON reading_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reading history" ON reading_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reading history" ON reading_history
  FOR UPDATE USING (auth.uid() = user_id);
```

## 6. Test Your Setup

1. Start your app: `npm start`
2. Try to sign up with a new account
3. Check your Supabase dashboard under **Authentication** → **Users** to see if the user was created
4. Try signing in with the created account

## 7. Environment Variables (Recommended for Production)

For production, consider using environment variables:

1. Install `expo-constants`: `npm install expo-constants`
2. Create a `.env` file in your project root:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```
3. Update `src/config/supabase.js`:
```javascript
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || 'YOUR_SUPABASE_ANON_KEY';
```

## Troubleshooting

### Common Issues:

1. **"Invalid API key"**: Double-check your Project URL and anon key
2. **"Email not confirmed"**: Check your Supabase email settings
3. **"Network error"**: Verify your internet connection and Supabase project status
4. **"User not found"**: Make sure you're using the correct email/password

### Getting Help:

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord Community](https://discord.supabase.com)
- [Expo Documentation](https://docs.expo.dev)

## Security Notes

- Never commit your Supabase keys to version control
- Use environment variables for production
- Enable Row Level Security (RLS) for all tables
- Regularly rotate your API keys
- Monitor your Supabase usage and costs
