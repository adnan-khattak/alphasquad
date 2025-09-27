import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '../constants/dimensions';

const HomeScreen = ({ navigation }) => {
  const [userStats] = useState({
    missionsCompleted: 47,
    rank: 'Lieutenant',
    experience: 2840,
    nextRank: 'Captain',
  });

  const [missions] = useState([
    {
      id: 1,
      title: 'Operation Nightfall',
      status: 'Active',
      progress: 75,
      difficulty: 'High',
      reward: 500,
    },
    {
      id: 2,
      title: 'Urban Reconnaissance',
      status: 'Completed',
      progress: 100,
      difficulty: 'Medium',
      reward: 300,
    },
    {
      id: 3,
      title: 'Stealth Infiltration',
      status: 'Pending',
      progress: 0,
      difficulty: 'Extreme',
      reward: 750,
    },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return COLORS.accent;
      case 'Completed':
        return COLORS.success;
      case 'Pending':
        return COLORS.warning;
      default:
        return COLORS.gray;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Low':
        return COLORS.success;
      case 'Medium':
        return COLORS.warning;
      case 'High':
        return COLORS.accent;
      case 'Extreme':
        return COLORS.error;
      default:
        return COLORS.gray;
    }
  };

  const MissionCard = ({ mission }) => (
    <View style={styles.missionCard}>
      <View style={styles.missionHeader}>
        <Text style={styles.missionTitle}>{mission.title}</Text>
        <View style={[styles.statusDot, { backgroundColor: getStatusColor(mission.status) }]} />
      </View>
      
      <View style={styles.missionDetails}>
        <Text style={styles.detailText}>
          {mission.difficulty} • {mission.reward} XP
        </Text>
      </View>

      {mission.status === 'Active' && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${mission.progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{mission.progress}%</Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Alpha Agent</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.replace('Auth')}>
            <Ionicons name="log-out-outline" size={24} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats.missionsCompleted}</Text>
            <Text style={styles.statLabel}>missions</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats.experience}</Text>
            <Text style={styles.statLabel}>xp</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats.rank}</Text>
            <Text style={styles.statLabel}>rank</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>Start Mission</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>View Squad</Text>
          </TouchableOpacity>
        </View>

        {/* Missions */}
        <View style={styles.missionsSection}>
          <Text style={styles.sectionTitle}>Active Missions</Text>
          {missions.map((mission) => (
            <MissionCard key={mission.id} mission={mission} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
  },
  greeting: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '300',
    color: COLORS.textPrimary,
  },
  logoutButton: {
    padding: SPACING.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.xl,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '300',
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.xl,
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.md,
    flex: 1,
    marginHorizontal: SPACING.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.textMuted,
  },
  actionText: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
  },
  missionsSection: {
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  missionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.textMuted,
  },
  missionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  missionTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    color: COLORS.textPrimary,
    flex: 1,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  missionDetails: {
    marginBottom: SPACING.sm,
  },
  detailText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 2,
    backgroundColor: COLORS.textMuted,
    borderRadius: 1,
    marginRight: SPACING.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.accent,
    borderRadius: 1,
  },
  progressText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
});

export default HomeScreen;
