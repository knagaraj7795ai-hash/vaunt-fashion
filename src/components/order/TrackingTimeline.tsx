import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TrackingStep } from '../../types/order';
import { COLORS, RADIUS, TYPOGRAPHY, SPACING } from '../../constants/theme';

interface TrackingTimelineProps {
  steps: TrackingStep[];
}

export const TrackingTimeline: React.FC<TrackingTimelineProps> = ({ steps }) => {
  return (
    <View style={styles.container}>
      {steps.map((step, idx) => {
        const isLast = idx === steps.length - 1;

        return (
          <View key={idx} style={styles.stepItem}>
            {/* Timeline Left Column */}
            <View style={styles.leftColumn}>
              <View
                style={[
                  styles.nodeCircle,
                  step.completed && !step.isCurrent && styles.completedNode,
                  step.isCurrent && styles.currentNode,
                  !step.completed && styles.pendingNode,
                ]}
              >
                {step.completed && !step.isCurrent ? (
                  <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                ) : step.isCurrent ? (
                  <View style={styles.activeCore} />
                ) : (
                  <View style={styles.pendingCore} />
                )}
              </View>

              {!isLast && (
                <View
                  style={[
                    styles.connectorLine,
                    step.completed ? styles.completedLine : styles.pendingLine,
                  ]}
                />
              )}
            </View>

            {/* Timeline Right Content */}
            <View style={styles.rightContent}>
              <View style={styles.titleRow}>
                <Text
                  style={[
                    styles.stepTitle,
                    step.isCurrent && styles.activeTitle,
                    !step.completed && styles.pendingText,
                  ]}
                >
                  {step.title}
                </Text>
                {step.timestamp !== 'Pending' && (
                  <Text style={styles.stepTimestamp}>{step.timestamp}</Text>
                )}
              </View>
              <Text
                style={[
                  styles.stepDesc,
                  !step.completed && styles.pendingDesc,
                ]}
              >
                {step.description}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    padding: SPACING.base,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  stepItem: {
    flexDirection: 'row',
    minHeight: 64,
  },
  leftColumn: {
    alignItems: 'center',
    width: 24,
    marginRight: 14,
  },
  nodeCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  completedNode: {
    backgroundColor: COLORS.emerald,
  },
  currentNode: {
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  pendingNode: {
    backgroundColor: COLORS.surfaceSubtle,
    borderWidth: 1.5,
    borderColor: COLORS.borderDark,
  },
  activeCore: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
  },
  pendingCore: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.borderDark,
  },
  connectorLine: {
    width: 2,
    flex: 1,
    marginVertical: 4,
  },
  completedLine: {
    backgroundColor: COLORS.emerald,
  },
  pendingLine: {
    backgroundColor: COLORS.border,
  },
  rightContent: {
    flex: 1,
    paddingBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  stepTitle: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textPrimary,
  },
  activeTitle: {
    color: COLORS.accent,
    fontWeight: '800',
  },
  stepTimestamp: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    fontSize: 11,
  },
  stepDesc: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 3,
    lineHeight: 16,
  },
  pendingText: {
    color: COLORS.textMuted,
  },
  pendingDesc: {
    color: COLORS.textSubtle,
  },
});
