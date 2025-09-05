import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar, DollarSign, Bell } from 'lucide-react-native';
import { Database } from '@/types/database';
import { formatDate, getDaysUntil } from '@/utils/dateUtils';

type Subscription = Database['public']['Tables']['subscriptions']['Row'];

interface SubscriptionCardProps {
  subscription: Subscription;
  onPress?: () => void;
}

export function SubscriptionCard({ subscription, onPress }: SubscriptionCardProps) {
  const daysUntil = getDaysUntil(new Date(subscription.renewal_date));
  const isUrgent = daysUntil <= 3;
  const isUpcoming = daysUntil <= 7;

  const getStatusColor = () => {
    if (isUrgent) return '#EF4444';
    if (isUpcoming) return '#F59E0B';
    return '#10B981';
  };

  const getStatusText = () => {
    if (daysUntil === 0) return 'Due Today';
    if (daysUntil < 0) return 'Overdue';
    if (daysUntil === 1) return 'Due Tomorrow';
    return `${daysUntil} days`;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.name} numberOfLines={1}>
          {subscription.name}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>{getStatusText()}</Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <DollarSign color="#64748B" size={16} />
          <Text style={styles.detailText}>
            ${subscription.amount.toFixed(2)} / {subscription.billing_period}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Calendar color="#64748B" size={16} />
          <Text style={styles.detailText}>
            {formatDate(new Date(subscription.renewal_date))}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Bell color="#64748B" size={16} />
          <Text style={styles.detailText}>
            {subscription.reminder_days_before} days before
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  details: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#64748B',
  },
});