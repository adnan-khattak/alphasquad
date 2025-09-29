import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  // SafeAreaView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '../constants/dimensions';
import { BookService } from '../utils/bookService';

const screenWidth = Dimensions.get('window').width;

const StatsScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const [stats, setStats] = useState({
    weeklyPagesRead: 0,
    averagePagesPerDay: 0,
    readingStreak: { currentStreak: 0, longestStreak: 0 },
    weeklyData: [],
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = async () => {
    try {
      const [weeklyPagesRead, averagePagesPerDay, weeklyData] = await Promise.all([
        BookService.getWeeklyPagesRead(),
        BookService.getAveragePagesPerDay(7),
        BookService.getReadingStats(7),
      ]);

      // Compute streak based on history from BookService
      const historyMap = await BookService.getReadingHistory(60);
      const dates = Object.keys(historyMap).sort();
      let currentStreak = 0;
      let longestStreak = 0;
      const today = new Date();
      let cursor = new Date(today);
      // Walk backwards from today; count consecutive days with >0 pages
      while (true) {
        const dateStr = cursor.toISOString().slice(0, 10);
        const pages = historyMap[dateStr] || 0;
        if (pages > 0) {
          currentStreak += 1;
          if (currentStreak > longestStreak) longestStreak = currentStreak;
        } else {
          // When breaking the current chain, the longest may be in past; compute full longest too
          break;
        }
        cursor.setDate(cursor.getDate() - 1);
      }
      // Compute longest across the window
      let rolling = 0;
      longestStreak = 0;
      const start = new Date(today);
      start.setDate(start.getDate() - 59);
      for (let i = 0; i < 60; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        const dateStr = d.toISOString().slice(0, 10);
        if ((historyMap[dateStr] || 0) > 0) {
          rolling += 1;
          if (rolling > longestStreak) longestStreak = rolling;
        } else {
          rolling = 0;
        }
      }

      setStats({
        weeklyPagesRead,
        averagePagesPerDay,
        readingStreak: { currentStreak, longestStreak },
        weeklyData,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
  };

  const getStreakEmoji = (streak) => {
    if (streak >= 30) return '🔥';
    if (streak >= 14) return '⭐';
    if (streak >= 7) return '📚';
    if (streak >= 3) return '📖';
    return '📕';
  };

  const getMotivationalMessage = (streak) => {
    if (streak >= 30) return 'Incredible! You\'re on fire! 🔥';
    if (streak >= 14) return 'Amazing dedication! ⭐';
    if (streak >= 7) return 'Great consistency! 📚';
    if (streak >= 3) return 'Keep it up! 📖';
    return 'Start your reading journey! 📕';
  };

  const chartData = {
    labels: stats.weeklyData.map(day => day.dayName),
    datasets: [
      {
        data: stats.weeklyData.map(day => day.pagesRead),
        color: (opacity = 1) => `rgba(${isDark ? '255, 255, 255' : '0, 0, 0'}, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: colors.surface,
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => colors.textPrimary,
    labelColor: (opacity = 1) => colors.textSecondary,
    style: {
      borderRadius: BORDER_RADIUS.lg,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: colors.accent,
    },
    propsForBackgroundLines: {
      strokeDasharray: '5,5',
      stroke: colors.textMuted,
    },
  };

  const StatCard = ({ title, value, subtitle, icon, color = colors.accent }) => (
    <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.textMuted }]}>
      <View style={styles.statHeader}>
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon} size={24} color={color} />
        </View>
        <Text style={[styles.statTitle, { color: colors.textSecondary }]}>{title}</Text>
      </View>
      <Text style={[styles.statValue, { color: colors.textPrimary }]}>{value}</Text>
      {subtitle && (
        <Text style={[styles.statSubtitle, { color: colors.textMuted }]}>{subtitle}</Text>
      )}
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -SPACING.sm,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
    placeholder: {
      width: 40,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: SPACING.xl,
    },
    streakSection: {
      marginBottom: SPACING.xl,
    },
    streakCard: {
      backgroundColor: colors.surface,
      borderRadius: BORDER_RADIUS.xl,
      padding: SPACING.xxl,
      borderWidth: 0,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 6,
    },
    streakEmoji: {
      fontSize: 56,
      marginBottom: SPACING.lg,
    },
    streakNumber: {
      fontSize: FONT_SIZES.xxxxl,
      fontWeight: '800',
      color: colors.accent,
      marginBottom: SPACING.sm,
      letterSpacing: -1,
    },
    streakLabel: {
      fontSize: FONT_SIZES.lg,
      color: colors.textSecondary,
      marginBottom: SPACING.lg,
      fontWeight: '500',
    },
    streakMessage: {
      fontSize: FONT_SIZES.sm,
      color: colors.textMuted,
      textAlign: 'center',
      fontStyle: 'italic',
    },
    longestStreak: {
      fontSize: FONT_SIZES.sm,
      color: colors.textMuted,
      marginTop: SPACING.md,
    },
    statsGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: SPACING.xl,
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: BORDER_RADIUS.xl,
      padding: SPACING.xl,
      marginHorizontal: SPACING.sm,
      borderWidth: 0,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    statHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: SPACING.sm,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: SPACING.sm,
    },
    statTitle: {
      fontSize: FONT_SIZES.xs,
      color: colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 1,
      flex: 1,
    },
    statValue: {
      fontSize: FONT_SIZES.xxxl,
      fontWeight: '800',
      color: colors.textPrimary,
      marginBottom: SPACING.sm,
      letterSpacing: -0.5,
    },
    statSubtitle: {
      fontSize: FONT_SIZES.sm,
      color: colors.textMuted,
      fontWeight: '500',
    },
    chartSection: {
      marginBottom: SPACING.xl,
    },
    sectionTitle: {
      fontSize: FONT_SIZES.xl,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: SPACING.xl,
      letterSpacing: -0.3,
    },
    chartContainer: {
      backgroundColor: colors.surface,
      borderRadius: BORDER_RADIUS.xl,
      padding: SPACING.xl,
      borderWidth: 0,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: SPACING.xl,
    },
    emptyIcon: {
      marginBottom: SPACING.lg,
    },
    emptyTitle: {
      fontSize: FONT_SIZES.xl,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: SPACING.sm,
      textAlign: 'center',
    },
    emptySubtitle: {
      fontSize: FONT_SIZES.md,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
    },
    refreshButton: {
      backgroundColor: colors.accent,
      borderRadius: BORDER_RADIUS.md,
      paddingVertical: SPACING.md,
      paddingHorizontal: SPACING.xl,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: SPACING.lg,
    },
    refreshButtonText: {
      fontSize: FONT_SIZES.md,
      fontWeight: '600',
      color: colors.background,
      marginLeft: SPACING.sm,
    },
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Reading Stats</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="stats-chart-outline" size={64} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>Loading Stats...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const hasReadingData = stats.weeklyPagesRead > 0 || stats.readingStreak.currentStreak > 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reading Stats</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {!hasReadingData ? (
          <View style={styles.emptyState}>
            <Ionicons name="stats-chart-outline" size={64} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No Reading Data Yet</Text>
            <Text style={styles.emptySubtitle}>
              Start reading and updating your progress to see your stats here
            </Text>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={() => navigation.navigate('BookList')}
            >
              <Ionicons name="book-outline" size={20} color={colors.background} />
              <Text style={styles.refreshButtonText}>Go to Books</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Reading Streak */}
            <View style={styles.streakSection}>
              <Text style={styles.sectionTitle}>Reading Streak</Text>
              <View style={styles.streakCard}>
                <Text style={styles.streakEmoji}>
                  {getStreakEmoji(stats.readingStreak.currentStreak)}
                </Text>
                <Text style={styles.streakNumber}>
                  {stats.readingStreak.currentStreak}
                </Text>
                <Text style={styles.streakLabel}>days in a row</Text>
                <Text style={styles.streakMessage}>
                  {getMotivationalMessage(stats.readingStreak.currentStreak)}
                </Text>
                {stats.readingStreak.longestStreak > 0 && (
                  <Text style={styles.longestStreak}>
                    Longest streak: {stats.readingStreak.longestStreak} days
                  </Text>
                )}
              </View>
            </View>

            {/* Weekly Stats */}
            <View style={styles.sectionTitle}>This Week</View>
            <View style={styles.statsGrid}>
              <StatCard
                title="Pages Read"
                value={stats.weeklyPagesRead}
                subtitle="this week"
                icon="book-outline"
                color={colors.accent}
              />
              <StatCard
                title="Daily Average"
                value={stats.averagePagesPerDay}
                subtitle="pages/day"
                icon="trending-up-outline"
                color={colors.success}
              />
            </View>

            {/* Weekly Chart */}
            <View style={styles.chartSection}>
              <Text style={styles.sectionTitle}>Pages Read (Last 7 Days)</Text>
              <View style={styles.chartContainer}>
                <BarChart
                  data={chartData}
                  width={screenWidth - SPACING.xl * 2 - SPACING.md * 2}
                  height={220}
                  chartConfig={chartConfig}
                  style={{
                    marginVertical: SPACING.sm,
                    borderRadius: BORDER_RADIUS.md,
                  }}
                  showValuesOnTopOfBars={true}
                  fromZero={true}
                />
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default StatsScreen;
