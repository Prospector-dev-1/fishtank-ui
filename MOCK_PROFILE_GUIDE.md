# Mock Profile Guide

This guide explains how to use the mock profile feature for the Innovator profile page.

## Overview

The mock profile feature allows you to preview what the profile page will look like once the backend and database are fully integrated. It displays realistic sample data including profile information, innovations, pitches, and statistics.

## How to Access Mock Profile

There are three ways to view the mock profile:

### 1. Using URL Parameter (Recommended)
Navigate to the profile page with the `mock=true` parameter:
```
http://localhost:5173/innovator/profile?mock=true
```

This method is recommended because:
- The mock state persists when you reload the page
- Easy to share with team members
- Bookmark-friendly

### 2. Using Preview Mode Button
If you have a profile loaded (or no profile):
1. Navigate to `/innovator/profile`
2. Click the "Preview Mode" button in the profile header
3. The page will reload with mock data

### 3. From "Profile Not Found" Screen
If you don't have a profile yet:
1. Navigate to `/innovator/profile`
2. Click "View Mock Profile" button
3. The mock profile will be displayed

## Features

The mock profile includes:

### Profile Information
- **Name**: Alex Rivera
- **Role**: Serial Innovator & Tech Entrepreneur
- **Location**: San Francisco, CA
- **Company**: TechVentures Inc.
- **Bio**: Detailed professional background
- **Skills**: 8+ professional skills
- **Interests**: 6 areas of interest
- **Seeking**: 5 items (funding, co-founders, advisors, etc.)

### Statistics
- **3 Innovations** (HealthAI Diagnostics, EduConnect, GreenChain)
- **2 Pitches** (with investor engagement metrics)
- **5 Connections** (network contacts)
- **2 Teams** (collaborative groups)

### Tabs
1. **Overview**: Complete profile information with editable fields
2. **Innovations**: List of innovation projects with status
3. **Public Profile**: Pitch presentations and materials

## Exiting Preview Mode

To return to your real profile (or empty state):
1. Click the "Exit Preview" button in the blue banner at the top
2. Or remove `?mock=true` from the URL

## Mock Data Location

All mock data is stored in:
```
src/lib/innovator/mockProfileData.ts
```

### Available Mock Profiles

The file includes:
- **Primary Mock Profile**: Alex Rivera (default)
- **Alternative Profile 1**: Jamie Chen (Climate Tech Innovator)
- **Alternative Profile 2**: Marcus Williams (FinTech Builder)

### Customizing Mock Data

To customize the mock data:
1. Open `/src/lib/innovator/mockProfileData.ts`
2. Edit the `mockProfile` object or any related data
3. Changes will appear immediately when viewing in preview mode

## Use Cases

### For Developers
- Test UI layout with realistic data
- Verify responsive design
- Debug profile features without backend
- Demonstrate features to stakeholders

### For Designers
- Review profile layout and styling
- Test different content lengths
- Evaluate user experience flow

### For Product Managers
- Demo the profile feature
- Share with stakeholders
- Gather feedback on profile structure

## Technical Details

### Implementation
- Mock data toggle is managed via React state
- URL parameter support using React Router's `useSearchParams`
- State persists across page reloads when using URL parameter
- Seamless switching between mock and real data

### Data Structure
Mock data follows the same schema as the Supabase database:
- Profiles table schema
- Innovations table schema
- Pitches table schema
- Connections table schema
- Teams table schema

## Future Enhancements

Potential improvements:
- [ ] Multiple mock profile variants (toggle between different personas)
- [ ] Randomized mock data for testing
- [ ] Export/import custom mock profiles
- [ ] Mock data for team members and connections
- [ ] Simulated API delays for realistic loading states

## Notes

- The mock profile is **read-only in some areas** - editing may work but won't persist
- Stats are pre-calculated based on mock data arrays
- All images use placeholder URLs from Unsplash
- Mock data is client-side only and doesn't affect the database

## Support

If you encounter any issues with the mock profile feature:
1. Check browser console for errors
2. Verify you're using the latest version of the code
3. Clear browser cache if data appears stale
4. Report issues to the development team

---

**Last Updated**: October 2025
**Feature Status**: ✅ Active

