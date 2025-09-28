import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '../constants/dimensions';
import { BookStorage } from '../utils/bookStorage';

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
      const [
        weeklyPagesRead,
        averagePagesPerDay,
        readingStreak,
        weeklyData,
      ] = await Promise.all([
        BookStorage.getWeeklyPagesRead(),
        BookStorage.getAveragePagesPerDay(7),
        BookStorage.getReadingStreak(),
        BookStorage.getReadingStats(7),
      ]);

      setStats({
        weeklyPagesRead,
        averagePagesPerDay,
        readingStreak,
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
      paddingVertical: SPACING.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.textMuted,
    },
    backButton: {
      padding: SPACING.sm,
      marginLeft: -SPACING.sm,
    },
    headerTitle: {
      fontSize: FONT_SIZES.lg,
      fontWeight: '600',
      color: colors.textPrimary,
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
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.xl,
      borderWidth: 1,
      borderColor: colors.textMuted,
      alignItems: 'center',
    },
    streakEmoji: {
      fontSize: 48,
      marginBottom: SPACING.md,
    },
    streakNumber: {
      fontSize: FONT_SIZES.xxxl,
      fontWeight: '700',
      color: colors.accent,
      marginBottom: SPACING.xs,
    },
    streakLabel: {
      fontSize: FONT_SIZES.md,
      color: colors.textSecondary,
      marginBottom: SPACING.sm,
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
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.lg,
      marginHorizontal: SPACING.xs,
      borderWidth: 1,
      borderColor: colors.textMuted,
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
      fontSize: FONT_SIZES.xl,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: SPACING.xs,
    },
    statSubtitle: {
      fontSize: FONT_SIZES.xs,
      color: colors.textMuted,
    },
    chartSection: {
      marginBottom: SPACING.xl,
    },
    sectionTitle: {
      fontSize: FONT_SIZES.lg,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: SPACING.lg,
    },
    chartContainer: {
      backgroundColor: colors.surface,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.md,
      borderWidth: 1,
      borderColor: colors.textMuted,
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
