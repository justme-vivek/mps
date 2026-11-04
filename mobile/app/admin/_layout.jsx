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
import AdminDrawerContent from '../../src/components/admin/AdminDrawerContent';
import { useBreakpoint } from '../../src/hooks/useBreakpoint';
import { colors, fonts, layout } from '../../src/theme/tokens';

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

/**
 * Admin area. Phones: slide-in navy drawer under a navy header.
 * Laptops (1024px+): the drawer is a permanent 248px sidebar and the header
 * becomes a light page-title bar.
 */
export default function AdminLayout() {
  const { isWide } = useBreakpoint();
  return (
    <Drawer
      drawerContent={(props) => <AdminDrawerContent {...props} />}
      screenOptions={{
        drawerType: isWide ? 'permanent' : 'front',
        headerShown: true,
        headerLeft: isWide ? () => null : undefined,
        headerStyle: isWide
          ? { backgroundColor: colors.paper, borderBottomWidth: 1.5, borderBottomColor: colors.line, height: 64 }
          : { backgroundColor: colors.ink },
        headerTintColor: isWide ? colors.ink : colors.white,
        headerTitleStyle: { fontFamily: fonts.serif, fontSize: isWide ? 22 : 20, fontWeight: '400' },
        headerTitleContainerStyle: isWide ? { marginLeft: 24 } : undefined,
        headerShadowVisible: false,
        sceneStyle: { backgroundColor: colors.paper },
        drawerActiveBackgroundColor: colors.marker,
        drawerActiveTintColor: colors.ink,
        drawerInactiveTintColor: '#E4E9FA',
        drawerLabelStyle: { fontFamily: fonts.sansBold, fontWeight: '400', fontSize: 15, marginLeft: -4 },
        drawerItemStyle: { borderRadius: 10, minHeight: 44, justifyContent: 'center' },
        drawerStyle: {
          backgroundColor: colors.ink,
          width: layout.sidebarWidth,
          borderRightWidth: 0,
        },
        overlayColor: 'rgba(17,27,61,0.55)',
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
