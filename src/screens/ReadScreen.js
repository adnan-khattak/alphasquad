import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useTheme } from '../contexts/ThemeContext';
import GradientBackground from '../components/GradientBackground';
import { ReaderService } from '../utils/readerService';

const ReadScreen = ({ route, navigation }) => {
  const { colors } = useTheme();
  const { title, author, gutenbergId, fallbackLink, readUrl } = route.params || {};

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [source, setSource] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        // Prefer saved readUrl first
        if (readUrl) {
          setSource({ uri: readUrl });
          return;
        }
        const result = await ReaderService.findPublicDomainBook({ title, author, gutenbergId });
        if (!result) {
          if (fallbackLink) {
            setSource({ uri: fallbackLink });
            return;
          }
          setError('No public-domain source found for this book.');
          return;
        }
        setSource({ uri: result.url });
      } catch (e) {
        setError(e.message || 'Failed to load book.');
      } finally {
        setLoading(false);
      }
    })();
  }, [title, author, gutenbergId]);

  if (loading) {
    return (
      <GradientBackground colors={[colors.gradientStart, colors.gradientEnd]}>
        <View style={[styles.center, { backgroundColor: 'transparent' }]}> 
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={{ color: colors.textPrimary, marginTop: 12 }}>Loading book…</Text>
        </View>
      </GradientBackground>
    );
  }

  if (error) {
    return (
      <GradientBackground colors={[colors.gradientStart, colors.gradientEnd]}>
        <View style={[styles.center, { padding: 24 }]}> 
          <Text style={{ color: colors.textPrimary, fontWeight: '700', marginBottom: 8 }}>Unable to open</Text>
          <Text style={{ color: colors.textSecondary, textAlign: 'center', marginBottom: 16 }}>{error}</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingVertical: 12, paddingHorizontal: 20, backgroundColor: colors.accent, borderRadius: 12 }}>
            <Text style={{ color: colors.background, fontWeight: '700' }}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </GradientBackground>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {source ? (
        <WebView
          source={source}
          startInLoadingState
          renderLoading={() => (
            <View style={styles.center}>
              <ActivityIndicator size="large" color={colors.accent} />
            </View>
          )}
          allowsInlineMediaPlayback
          originWhitelist={["*"]}
        />
      ) : (
        <View style={styles.center}>
          <Text style={{ color: colors.textSecondary }}>No content.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ReadScreen;


