import React from 'react';
import { Drawer } from 'expo-router/drawer';
import {
  CalendarDays,
  DownloadCloud,
  FileText,
  Film,
  FolderOpen,
  ImagePlus,
  LayoutDashboard,
  Megaphone,
  Settings,
  UserCog,
  Users,
} from 'lucide-react-native';

const ICONS = {
  index: LayoutDashboard,
  banners: ImagePlus,
  notices: Megaphone,
  events: CalendarDays,
  gallery: FolderOpen,
  faculty: Users,
  downloads: DownloadCloud,
  media: Film,
  content: FileText,
  settings: Settings,
  profile: UserCog,
};

const TITLES = {
  index: 'Dashboard',
  banners: 'Hero Banners',
  notices: 'Notices',
  events: 'Events',
  gallery: 'Gallery',
  faculty: 'Faculty',
  downloads: 'Downloads',
  media: 'Media Library',
  content: 'Website Content',
  settings: 'Settings',
  profile: 'Profile',
};

export default function AdminLayout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#4338CA' },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: '800' },
        drawerActiveBackgroundColor: '#EEF2FF',
        drawerActiveTintColor: '#4F46E5',
        drawerInactiveTintColor: '#374151',
        drawerLabelStyle: { fontWeight: '600', fontSize: 14 },
        drawerStyle: { backgroundColor: '#FFFFFF', width: 272 },
        overlayColor: 'rgba(0,0,0,0.45)',
      }}
    >
      {Object.keys(TITLES).map((name) => {
        const Icon = ICONS[name];
        return (
          <Drawer.Screen
            key={name}
            name={name}
            options={{
              title: TITLES[name],
              drawerIcon: ({ color, size }) => <Icon size={size} color={color} />,
            }}
          />
        );
      })}
    </Drawer>
  );
}
