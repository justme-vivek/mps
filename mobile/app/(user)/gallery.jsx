import React, { useMemo, useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import { CameraOff, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Text from '../../src/components/ui/Text';
import Screen from '../../src/components/ui/Screen';
import PageTitle from '../../src/components/ui/PageTitle';
import Chip from '../../src/components/ui/Chip';
import Skeleton from '../../src/components/ui/Skeleton';
import EmptyState from '../../src/components/ui/EmptyState';
import DataBoundary from '../../src/components/feedback/DataBoundary';
import PhotoCard from '../../src/components/common/PhotoCard';
import ContentActions from '../../src/components/common/ContentActions';
import { useGallery } from '../../src/features/gallery/galleryService';
import { useBreakpoint } from '../../src/hooks/useBreakpoint';
import { colors, layout } from '../../src/theme/tokens';
import { ik } from '../../src/utils/ik';

const GAP = 12;

export default function GalleryScreen() {
  const insets = useSafeAreaInsets();
  const { width, columns, gutter } = useBreakpoint();
  const gallery = useGallery();
  const { data: photos = [], refetch, isRefetching } = gallery;
  const [category, setCategory] = useState('All');
  const [viewer, setViewer] = useState(null);

  const categories = useMemo(() => {
    const set = new Set(['All']);
    (photos || []).forEach((p) => set.add(p.category || 'General'));
    return Array.from(set);
  }, [photos]);

  const filtered = (photos || []).filter((p) => category === 'All' || (p.category || 'General') === category);

  // Tile size from the real column width, so the grid fills it exactly.
  const content = Math.min(width, layout.maxContentWidth) - gutter * 2;
  const size = Math.floor((content - GAP * (columns - 1)) / columns);

  return (
    <Screen bottomTabBar refresh={{ refreshing: isRefetching, onRefresh: refetch }}>
      <PageTitle title="Gallery" subtitle="Moments from school life" />

      <View className="mb-4 flex-row flex-wrap" style={{ gap: 8, display: categories.length > 2 ? 'flex' : 'none' }}>
        {categories.map((c) => (
          <Chip key={c} label={c} selected={category === c} onPress={() => setCategory(c)} />
        ))}
      </View>

      <DataBoundary
        query={gallery}
        skeleton={
          <View className="flex-row flex-wrap" style={{ gap: GAP }}>
            {Array.from({ length: columns * 2 }).map((_, i) => (
              <Skeleton key={i} style={{ width: size, height: size, borderRadius: 18 }} />
            ))}
          </View>
        }
        empty={{
          icon: <CameraOff size={32} color={colors.inkFaint} />,
          title: 'No photos yet',
          message: 'Moments from school life will appear here.',
        }}
      >
        {() =>
          filtered.length ? (
            <View className="flex-row flex-wrap" style={{ gap: GAP }}>
              {filtered.map((item) => (
                <PhotoCard key={item._id} photo={item} size={size} onPress={() => setViewer(item)} />
              ))}
            </View>
          ) : (
            <EmptyState title="Nothing in this category" message="Try another category." />
          )
        }
      </DataBoundary>

      {/* Full-screen photo viewer */}
      <Modal visible={!!viewer} animationType="fade" transparent onRequestClose={() => setViewer(null)}>
        <View className="flex-1 bg-primary-900/95">
          <View className="flex-row items-center justify-between px-4" style={{ paddingTop: Math.max(insets.top, 16) }}>
            <Text className="flex-1 font-serif text-[20px] text-white" numberOfLines={1}>
              {viewer?.title}
            </Text>
            <Pressable
              onPress={() => setViewer(null)}
              accessibilityRole="button"
              accessibilityLabel="Close photo"
              className="h-11 w-11 items-center justify-center"
            >
              <X size={24} color="#FFFFFF" />
            </Pressable>
          </View>
          {viewer ? (
            <Image
              source={{ uri: ik(viewer.imageUrl, 'w-1400') }}
              style={{ flex: 1 }}
              contentFit="contain"
              transition={250}
              accessibilityLabel={viewer.title}
            />
          ) : null}
          <View className="items-center" style={{ paddingBottom: Math.max(insets.bottom, 24) }}>
            {viewer ? (
              <View className="rounded-full bg-white/15 px-3">
                <ContentActions
                  itemType="gallery"
                  itemId={viewer._id}
                  title={viewer.title}
                  shareText={`Photo from MPS: ${viewer.title}`}
                />
              </View>
            ) : null}
          </View>
        </View>
      </Modal>
    </Screen>
  );
}
