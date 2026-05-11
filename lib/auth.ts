import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile, RestaurantMember } from "@/types/database";

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  return data;
}

export async function requireSuperAdmin(): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "super_admin") redirect("/login");
  return profile;
}

export async function requireAuth(): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  return profile;
}

export async function requireMember(restaurantId: string): Promise<RestaurantMember> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: member } = await supabase
    .from("restaurant_members")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .eq("profile_id", user.id)
    .single<RestaurantMember>();

  if (!member) redirect("/dashboard");
  return member;
}

/**
 * Passes for super_admin (all restaurants) or any member of the given restaurant.
 * Use this in server actions shared between admin and dashboard.
 */
export async function requireRestaurantAccess(
  restaurantId: string,
): Promise<{ profile: Profile; member: RestaurantMember | null }> {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  if (profile.role === "super_admin") {
    return { profile, member: null };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: member } = await supabase
    .from("restaurant_members")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .eq("profile_id", user.id)
    .single<RestaurantMember>();

  if (!member) redirect("/dashboard");
  return { profile, member };
}
