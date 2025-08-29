# Timezone Setup Guide

## Overview
This guide explains how to set up timezone functionality for the Focus Sessions app. The app now supports user-selectable timezones that affect how dates are displayed in the heatmap and activity feed.

## Database Setup

### 1. Create the user_preferences table
Run the SQL script `SUPABASE_USER_PREFERENCES_SETUP.sql` in your Supabase SQL editor to create the necessary table and policies.

### 2. What the table contains
- `id`: Unique identifier for each preference record
- `user_id`: References the auth.users table
- `timezone`: User's selected timezone (e.g., "America/New_York", "Europe/London")
- `created_at`: When the preference was first created
- `updated_at`: When the preference was last updated

### 3. Security
- Row Level Security (RLS) is enabled
- Users can only access their own preferences
- Automatic timestamp updates via triggers

## Features

### 1. Automatic Timezone Detection
- The app automatically detects the user's current timezone on first visit
- Falls back to UTC if detection fails

### 2. Timezone Selection
- Users can change their timezone from the profile page
- Timezone selector is located below the profile avatar
- Searchable dropdown with common timezones

### 3. Real-time Updates
- Heatmap updates immediately when timezone changes
- Activity feed timestamps respect the selected timezone
- All date calculations use the user's preferred timezone

## Components Updated

### 1. DeepWorkHeatmap
- Now accepts `userTimezone` prop
- Correctly aligns weekdays based on timezone
- Session dates are converted to user's timezone

### 2. ActivityFeed
- Now accepts `userTimezone` prop
- "Time ago" calculations respect timezone
- Date formatting uses local timezone

### 3. Profile Page
- Added timezone selector below profile avatar
- Shows current timezone setting
- Allows users to change timezone

## Usage

### For Users
1. Visit your profile page
2. Find the timezone selector below your profile picture
3. Click to open the dropdown
4. Search for your timezone or select from the list
5. Your heatmap and activity feed will update immediately

### For Developers
The timezone is automatically passed to components that need it:
- `DeepWorkHeatmap` receives `userTimezone` prop
- `ActivityFeed` receives `userTimezone` prop
- All date calculations use the selected timezone

## Troubleshooting

### Common Issues
1. **Timezone not saving**: Check that the `user_preferences` table exists and RLS policies are correct
2. **Dates still showing in UTC**: Verify the timezone is being passed correctly to components
3. **Heatmap week alignment wrong**: Ensure the timezone conversion is working in `DeepWorkHeatmap`

### Debug Steps
1. Check browser console for timezone conversion errors
2. Verify the `currentTimezone` value in the `useUserPreferences` hook
3. Confirm the timezone is being passed to child components
4. Test with different timezones to isolate the issue

## Future Enhancements
- Timezone validation
- Automatic daylight saving time handling
- Timezone-specific date formatting options
- Export timezone preferences
