'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Home, 
  ChevronRight, 
  Camera,
  Calendar,
  Edit,
  Lock,
  Shield,
  Trash2,
  LogOut,
  Check,
  Code,
  Search,
  Award,
  Flame
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardStats } from '@/hooks/useDashboard';
import GlassmorphicNavbar from '@/components/layout/GlassmorphicNavbar';
import { GlassmorphicFooter } from '@/components/layout/GlassmorphicFooter';
import { useRequireAuth } from '@/hooks/useRequireAuth';

export default function ProfilePage() {
  const { loading: authLoading } = useRequireAuth();
  const { user, signOut } = useAuth();
  const { data: stats } = useDashboardStats();
  const router = useRouter();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Form state
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Calculate activity stats
  const totalSolutions = stats?.total_solutions || 0;
  const totalSearches = stats?.total_searches || 0;
  const reputation = 850; // Placeholder - calculate from user activity
  const streak = 12; // Placeholder - calculate from consecutive days

  // Badges
  const joinDate = user?.created_at ? new Date(user.created_at).getFullYear() : 2024;

  // Handle form submission
  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement API call to update user profile
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setSaveSuccess(true);
      setIsEditing(false); // Exit edit mode after save
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle cancel editing
  const handleCancelEdit = () => {
    // Reset form to original values
    setFullName(user?.user_metadata?.full_name || '');
    setUsername('');
    setBio('');
    setIsEditing(false);
  };

  // Handle password change
  const handleChangePassword = () => {
    // TODO: Implement password change modal/flow
  };

  // Handle sign out all sessions
  const handleSignOutAll = async () => {
    // TODO: Implement sign out all sessions
    await signOut();
  };

  // Handle delete account
  const handleDeleteAccount = () => {
    // TODO: Implement delete account with confirmation modal
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Delete account logic here
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <GlassmorphicNavbar />
      <main className="flex-1 pt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-8">
          <Link 
            href="/" 
            className="text-white/60 hover:text-white transition-colors flex items-center gap-1"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-4 h-4 text-white/40" />
          <span className="text-[#07b9d5]">Profile</span>
        </nav>

        {/* Profile Header */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-6">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#07b9d5] to-[#059ab3] flex items-center justify-center text-white text-3xl font-bold">
                {(user?.user_metadata?.full_name?.[0] || user?.email?.[0] || 'U').toUpperCase()}
              </div>
              <button className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white mb-1">
                {user?.user_metadata?.full_name || 'User'}
              </h1>
              <p className="text-white/60 mb-3">{user?.email}</p>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-gradient-to-r from-[#07b9d5] to-[#059ab3] text-white text-xs font-medium rounded-full">
                  Pro Member
                </span>
                <span className="px-3 py-1 bg-white/10 text-white/80 text-xs font-medium rounded-full flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Joined {joinDate}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Overview */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Activity Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Searches */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-[#07b9d5]/40 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <Search className="w-5 h-5 text-[#07b9d5]" />
                <span className="text-2xl font-bold text-white">{totalSearches}</span>
              </div>
              <p className="text-white/60 text-sm">Total Searches</p>
            </div>

            {/* Solutions */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-[#07b9d5]/40 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <Code className="w-5 h-5 text-[#07b9d5]" />
                <span className="text-2xl font-bold text-white">{totalSolutions}</span>
              </div>
              <p className="text-white/60 text-sm">Solutions</p>
            </div>

            {/* Reputation */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-[#07b9d5]/40 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <Award className="w-5 h-5 text-[#07b9d5]" />
                <span className="text-2xl font-bold text-white">{reputation}</span>
              </div>
              <p className="text-white/60 text-sm">Reputation</p>
            </div>

            {/* Streak */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-[#07b9d5]/40 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <Flame className="w-5 h-5 text-[#07b9d5]" />
                <span className="text-2xl font-bold text-white">{streak}</span>
              </div>
              <p className="text-white/60 text-sm">Day Streak</p>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Personal Information</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-white transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span className="text-sm font-medium">Edit</span>
              </button>
            )}
          </div>

          {/* View Mode */}
          {!isEditing ? (
            <div className="space-y-4">
              {/* Full Name - View */}
              <div className="pb-4 border-b border-white/10">
                <label className="block text-white/60 text-xs font-medium mb-2 uppercase tracking-wider">
                  Full Name
                </label>
                <p className="text-white text-base">
                  {fullName || 'Not set'}
                </p>
              </div>

              {/* Username - View */}
              <div className="pb-4 border-b border-white/10">
                <label className="block text-white/60 text-xs font-medium mb-2 uppercase tracking-wider">
                  Username
                </label>
                <p className="text-white text-base">
                  {username ? `@${username}` : 'Not set'}
                </p>
              </div>

              {/* Email - View (Read-only) */}
              <div className="pb-4 border-b border-white/10">
                <label className="block text-white/60 text-xs font-medium mb-2 uppercase tracking-wider">
                  Email Address
                </label>
                <p className="text-white text-base">
                  {user?.email}
                </p>
              </div>

              {/* Bio - View */}
              <div>
                <label className="block text-white/60 text-xs font-medium mb-2 uppercase tracking-wider">
                  Bio
                </label>
                <p className="text-white text-base whitespace-pre-wrap">
                  {bio || 'No bio added yet'}
                </p>
              </div>
            </div>
          ) : (
            /* Edit Mode */
            <div className="space-y-4">
              {/* Full Name - Edit */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white placeholder-white/40 focus:border-[#07b9d5] focus:ring-1 focus:ring-[#07b9d5] transition-colors"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Username - Edit */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Username
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">@</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 text-white placeholder-white/40 focus:border-[#07b9d5] focus:ring-1 focus:ring-[#07b9d5] transition-colors"
                    placeholder="username"
                  />
                </div>
              </div>

              {/* Email - Read-only even in edit mode */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white/60 cursor-not-allowed"
                />
                <p className="text-white/40 text-xs mt-1">Email cannot be changed</p>
              </div>

              {/* Bio - Edit */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:border-[#07b9d5] focus:ring-1 focus:ring-[#07b9d5] transition-colors resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className={`flex-1 h-12 rounded-xl font-medium transition-all ${
                    saveSuccess
                      ? 'bg-green-500 text-white'
                      : 'bg-gradient-to-r from-[#07b9d5] to-[#059ab3] text-white hover:shadow-lg hover:shadow-[#07b9d5]/20'
                  } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : saveSuccess ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  className="px-6 h-12 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>


        {/* Security & Access */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-5 h-5 text-[#07b9d5]" />
            <h2 className="text-xl font-semibold text-white">Security & Access</h2>
          </div>

          <div className="space-y-6">
            {/* Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-white/40" />
                <div>
                  <p className="text-white font-medium">Password</p>
                  <p className="text-white/60 text-sm">Last changed 3 months ago</p>
                </div>
              </div>
              <button
                onClick={handleChangePassword}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm font-medium"
              >
                Change Password
              </button>
            </div>

            {/* Two-Factor Authentication */}
            <div className="flex items-center justify-between pt-6 border-t border-white/10">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-white/40" />
                <div>
                  <p className="text-white font-medium">Two-Factor Authentication</p>
                  <p className="text-white/60 text-sm">
                    Add an extra layer of security to your account
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIs2FAEnabled(!is2FAEnabled)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  is2FAEnabled ? 'bg-[#07b9d5]' : 'bg-white/20'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    is2FAEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-white mb-6">Account Actions</h2>

          <div className="space-y-4">
            {/* Sign Out All Sessions */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <LogOut className="w-5 h-5 text-white/40" />
                <div>
                  <p className="text-white font-medium">Sign Out All Sessions</p>
                  <p className="text-white/60 text-sm">
                    This will sign you out from all devices
                  </p>
                </div>
              </div>
              <button
                onClick={handleSignOutAll}
                className="px-4 py-2 bg-white/10 hover:bg-[#07b9d5]/20 border border-white/10 hover:border-[#07b9d5]/40 text-white hover:text-[#07b9d5] rounded-lg transition-all text-sm font-medium flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out All
              </button>
            </div>

            {/* Delete Account */}
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-3">
                <Trash2 className="w-5 h-5 text-white/40" />
                <div>
                  <p className="text-white font-medium">Delete Account</p>
                  <p className="text-white/60 text-sm">
                    Permanently delete your account and all data
                  </p>
                </div>
              </div>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-white/10 hover:bg-[#07b9d5]/20 border border-white/10 hover:border-[#07b9d5]/40 text-white hover:text-[#07b9d5] rounded-lg transition-all text-sm font-medium flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Account
              </button>
            </div>
          </div>
        </div>
        </div>
      </main>
      <GlassmorphicFooter />
    </div>
  );
}
