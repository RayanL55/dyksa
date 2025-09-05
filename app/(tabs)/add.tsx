import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';
import { ChevronDown, Calendar, DollarSign, Bell, Info } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { router } from 'expo-router';

export default function AddSubscriptionScreen() {
  const { user } = useAuth();
  const { addSubscription } = useSubscriptions(user?.id);
  
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    billing_period: 'monthly' as 'monthly' | 'yearly' | 'custom',
    custom_period_days: '',
    renewal_date: new Date().toISOString().split('T')[0],
    reminder_days_before: '3',
  });
  const [loading, setLoading] = useState(false);

  const billingOptions = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
    { value: 'custom', label: 'Custom' },
  ];

  const reminderOptions = [
    { value: '1', label: '1 day before' },
    { value: '3', label: '3 days before' },
    { value: '7', label: '1 week before' },
    { value: '14', label: '2 weeks before' },
  ];

  const handleSubmit = async () => {
    if (!formData.name || !formData.amount || !formData.renewal_date) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (formData.billing_period === 'custom' && !formData.custom_period_days) {
      Alert.alert('Error', 'Please specify custom period days');
      return;
    }

    setLoading(true);
    try {
      const subscriptionData = {
        name: formData.name.trim(),
        amount,
        billing_period: formData.billing_period,
        custom_period_days: formData.billing_period === 'custom' 
          ? parseInt(formData.custom_period_days) 
          : undefined,
        renewal_date: formData.renewal_date,
        reminder_days_before: parseInt(formData.reminder_days_before),
      };

      const { error } = await addSubscription(subscriptionData);
      
      if (error) {
        Alert.alert('Error', error);
      } else {
        Alert.alert('Success', 'Subscription added successfully!', [
          { text: 'OK', onPress: () => router.push('/(tabs)') }
        ]);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to add subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Add Subscription</Text>
          <Text style={styles.subtitle}>
            Track your subscriptions and never miss a renewal
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Subscription Name <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
              placeholder="e.g., Netflix, Spotify"
              maxLength={50}
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelWithTooltip}>
              <Text style={styles.label}>
                Amount <Text style={styles.required}>*</Text>
              </Text>
              <Info color="#64748B" size={16} />
            </View>
            <View style={styles.amountInput}>
              <DollarSign color="#64748B" size={20} />
              <TextInput
                style={styles.amountField}
                value={formData.amount}
                onChangeText={(text) => setFormData(prev => ({ ...prev, amount: text }))}
                placeholder="0.00"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Billing Period</Text>
            <View style={styles.optionsGrid}>
              {billingOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionButton,
                    formData.billing_period === option.value && styles.optionButtonActive,
                  ]}
                  onPress={() => setFormData(prev => ({ 
                    ...prev, 
                    billing_period: option.value as typeof formData.billing_period 
                  }))}
                >
                  <Text
                    style={[
                      styles.optionText,
                      formData.billing_period === option.value && styles.optionTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {formData.billing_period === 'custom' && (
              <View style={styles.customPeriodInput}>
                <TextInput
                  style={styles.input}
                  value={formData.custom_period_days}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, custom_period_days: text }))}
                  placeholder="Enter days"
                  keyboardType="numeric"
                />
              </View>
            )}
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelWithTooltip}>
              <Text style={styles.label}>
                Next Renewal Date <Text style={styles.required}>*</Text>
              </Text>
              <Calendar color="#64748B" size={16} />
            </View>
            <TextInput
              style={styles.input}
              value={formData.renewal_date}
              onChangeText={(text) => setFormData(prev => ({ ...prev, renewal_date: text }))}
              placeholder="YYYY-MM-DD"
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelWithTooltip}>
              <Text style={styles.label}>Reminder Timing</Text>
              <Bell color="#64748B" size={16} />
            </View>
            <View style={styles.optionsGrid}>
              {reminderOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionButton,
                    formData.reminder_days_before === option.value && styles.optionButtonActive,
                  ]}
                  onPress={() => setFormData(prev => ({ 
                    ...prev, 
                    reminder_days_before: option.value 
                  }))}
                >
                  <Text
                    style={[
                      styles.optionText,
                      formData.reminder_days_before === option.value && styles.optionTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Adding...' : 'Add Subscription'}
            </Text>
          </TouchableOpacity>
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
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  form: {
    padding: 24,
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  required: {
    color: '#EF4444',
  },
  labelWithTooltip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1E293B',
  },
  amountInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
  },
  amountField: {
    flex: 1,
    padding: 16,
    paddingLeft: 8,
    fontSize: 16,
    color: '#1E293B',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  optionButtonActive: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  optionTextActive: {
    color: '#FFFFFF',
  },
  customPeriodInput: {
    marginTop: 12,
  },
  submitButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonDisabled: {
    backgroundColor: '#A78BFA',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});