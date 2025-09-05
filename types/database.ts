export interface Database {
  public: {
    Tables: {
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          amount: number;
          billing_period: 'monthly' | 'yearly' | 'custom';
          custom_period_days?: number;
          renewal_date: string;
          reminder_days_before: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          amount: number;
          billing_period: 'monthly' | 'yearly' | 'custom';
          custom_period_days?: number;
          renewal_date: string;
          reminder_days_before: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          amount?: number;
          billing_period?: 'monthly' | 'yearly' | 'custom';
          custom_period_days?: number;
          renewal_date?: string;
          reminder_days_before?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_preferences: {
        Row: {
          id: string;
          user_id: string;
          email_notifications: boolean;
          push_notifications: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          email_notifications?: boolean;
          push_notifications?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          email_notifications?: boolean;
          push_notifications?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}