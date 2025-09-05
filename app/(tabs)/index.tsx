import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Plus, Bell } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { SubscriptionCard } from '@/components/SubscriptionCard';
import { EmptyState } from '@/components/EmptyState';
import { LoadingScreen } from '@/components/LoadingScreen';
import { router } from 'expo-router';

export default function HomeScreen() {
  const { user } = useAuth();
  const { subscriptions, loading } = useSubscriptions(user?.id);

  const upcomingSubscriptions = subscriptions
    .filter(sub => {
      const daysUntil = Math.ceil(
        (new Date(sub.renewal_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysUntil >= 0 && daysUntil <= 30;
    })
    .slice(0, 5);

  if (loading) {
    return <LoadingScreen />;
  }

  const handleAddSubscription = () => {
    router.push('/(tabs)/add');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Good morning!</Text>
          <Text style={styles.subGreeting}>
            Manage your subscriptions with ease
          </Text>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.addButton} onPress={handleAddSubscription}>
            <Plus color="#FFFFFF" size={24} />
            <Text style={styles.addButtonText}>Add Subscription</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Bell color="#8B5CF6" size={20} />
            <Text style={styles.sectionTitle}>Next Reminders</Text>
          </View>

          {subscriptions.length === 0 ? (
            <EmptyState
              title="No subscriptions yet"
              description="Add your first subscription to start tracking renewals and never miss a payment again."
            />
          ) : upcomingSubscriptions.length === 0 ? (
            <EmptyState
              title="All caught up!"
              description="No upcoming renewals in the next 30 days. You're in great shape!"
            />
          ) : (
            <View style={styles.subscriptionsList}>
              {upcomingSubscriptions.map((subscription) => (
                <SubscriptionCard
                  key={subscription.id}
                  subscription={subscription}
                  onPress={() => {
                    // Handle subscription details view
                  }}
                />
              ))}
            </View>
          )}
        </View>

        <View style={styles.stats}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{subscriptions.length}</Text>
            <Text style={styles.statLabel}>Active Subscriptions</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              ${subscriptions.reduce((total, sub) => {
                const monthlyAmount = sub.billing_period === 'monthly' 
                  ? sub.amount 
                  : sub.billing_period === 'yearly'
                  ? sub.amount / 12
                  : sub.custom_period_days 
                  ? (sub.amount / sub.custom_period_days) * 30
                  : sub.amount;
                return total + monthlyAmount;
              }, 0).toFixed(0)}
            </Text>
            <Text style={styles.statLabel}>Monthly Total</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 16,
    color: '#64748B',
  },
  quickActions: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: '#8B5CF6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
  },
  subscriptionsList: {
    gap: 12,
  },
  stats: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B5CF6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
});