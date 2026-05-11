// Auto-generated types from Supabase CLI will replace this file.
// Run: npx supabase gen types typescript --project-id <project-id> > types/database.ts

// Matches Supabase's internal Json type for JSONB columns
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type UserRole = "super_admin" | "restaurant_owner";
export type MemberRole = "owner" | "manager" | "staff";
export type CurrencyCode = "CLP" | "USD" | "EUR" | "PEN" | "ARS" | "MXN";
export type ModifierType = "single" | "multiple";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface Restaurant {
  id: string;
  slug: string;
  name: string;
  legal_name: string | null;
  description: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  font_heading: string;
  font_body: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  instagram_handle: string | null;
  website_url: string | null;
  google_maps_url: string | null;
  reservation_url: string | null;
  opening_hours: Json | null;
  timezone: string;
  default_currency: CurrencyCode;
  default_language: string;
  supported_languages: string[];
  is_active: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface RestaurantMember {
  id: string;
  restaurant_id: string;
  profile_id: string;
  role: MemberRole;
  invited_by: string | null;
  created_at: string;
}

export interface MenuCategory {
  id: string;
  restaurant_id: string;
  name: Json;
  description: Json | null;
  icon: string | null;
  position: number;
  is_active: boolean;
  available_from: string | null;
  available_until: string | null;
  created_at: string;
  updated_at: string;
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  category_id: string;
  name: Json;
  description: Json | null;
  ingredients: Json | null;
  price: number;
  compare_at_price: number | null;
  currency: CurrencyCode;
  main_image_url: string | null;
  gallery_image_urls: string[] | null;
  dietary_tags: string[];
  allergens: string[];
  is_available: boolean;
  is_chef_recommendation: boolean;
  prep_time_minutes: number | null;
  calories: number | null;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface MenuModifier {
  id: string;
  restaurant_id: string;
  name: Json;
  type: ModifierType;
  is_required: boolean;
  min_selections: number;
  max_selections: number;
  created_at: string;
}

export interface ModifierOption {
  id: string;
  modifier_id: string;
  name: Json;
  price_delta: number;
  is_available: boolean;
  position: number;
}

export interface MenuItemModifier {
  item_id: string;
  modifier_id: string;
  position: number;
}

export interface AnalyticsEvent {
  id: string;
  restaurant_id: string;
  event_type: string;
  event_data: Json;
  session_id: string | null;
  created_at: string;
}

// Database type shaped exactly like Supabase CLI output so it satisfies GenericSchema
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "updated_at">;
        Update: Partial<Omit<Profile, "id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
      restaurants: {
        Row: Restaurant;
        Insert: Omit<Restaurant, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Restaurant, "id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
      restaurant_members: {
        Row: RestaurantMember;
        Insert: Omit<RestaurantMember, "id" | "created_at">;
        Update: Partial<Omit<RestaurantMember, "id" | "created_at">>;
        Relationships: [];
      };
      menu_categories: {
        Row: MenuCategory;
        Insert: Omit<MenuCategory, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<MenuCategory, "id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
      menu_items: {
        Row: MenuItem;
        Insert: Omit<MenuItem, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<MenuItem, "id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
      menu_modifiers: {
        Row: MenuModifier;
        Insert: Omit<MenuModifier, "id" | "created_at">;
        Update: Partial<Omit<MenuModifier, "id" | "created_at">>;
        Relationships: [];
      };
      modifier_options: {
        Row: ModifierOption;
        Insert: Omit<ModifierOption, "id">;
        Update: Partial<Omit<ModifierOption, "id">>;
        Relationships: [];
      };
      menu_item_modifiers: {
        Row: MenuItemModifier;
        Insert: MenuItemModifier;
        Update: Partial<MenuItemModifier>;
        Relationships: [];
      };
      analytics_events: {
        Row: AnalyticsEvent;
        Insert: Omit<AnalyticsEvent, "id" | "created_at">;
        Update: never;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_super_admin: { Args: Record<never, never>; Returns: boolean };
      is_member_of: { Args: { rid: string }; Returns: boolean };
    };
    Enums: {
      user_role: UserRole;
      member_role: MemberRole;
      currency_code: CurrencyCode;
      modifier_type: ModifierType;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
