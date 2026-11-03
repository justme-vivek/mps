import React, { useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, Text, View } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { CameraOff, X } from 'lucide-react-native';
import Screen from '../../src/components/ui/Screen';
import Skeleton from '../../src/components/ui/Skeleton';
import EmptyState from '../../src/components/ui/EmptyState';
import PhotoCard from '../../src/components/common/PhotoCard';
import ContentActions from '../../src/components/common/ContentActions';
import { useGallery } from '../../src/features/gallery/galleryService';
import { ik } from '../../src/utils/ik';

export default function GalleryScreen() {
  const { width } = useWindowDimensions();
  const { data: photos = [], isLoading, refetch, isRefetching } = useGallery();
  const [category, setCategory] = useState('All');
  const [viewer, setViewer] = useState(null);

  const categories = useMemo(() => {
    const set = new Set(['All']);
    (photos || []).forEach((p) => set.add(p.category || 'General'));
    return Array.from(set);
  }, [photos]);

  const filtered = (photos || []).filter((p) => category === 'All' || (p.category || 'General') === category);
  const size = Math.floor((width - 40 - 10) / 2);

  return (
    <Screen>
      <Text className="mb-3 text-2xl font-black text-ink">Gallery</Text>

      {/* Category chips */}
      <View className="mb-3 flex-row flex-wrap" style={{ gap: 8 }}>
        {categories.map((c) => (
          <Pressable
            key={c}
            onPress={() => setCategory(c)}
            className={`rounded-full px-3.5 py-1.5 ${category === c ? 'bg-primary-600' : 'bg-surface-sunken'}`}
          >
            <Text className={`text-[12px] font-bold ${category === c ? 'text-white' : 'text-ink-soft'}`}>{c}</Text>
          </Pressable>
        ))}
      </View>

      {isLoading ? (
        <View className="flex-row flex-wrap" style={{ gap: 10 }}>
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40" style={{ width: size }} />
          ))}
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item._id}
          numColumns={2}
          columnWrapperStyle={{ gap: 10, marginBottom: 10 }}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          onRefresh={refetch}
          refreshing={isRefetching}
          renderItem={({ item }) => (
            <PhotoCard photo={item} size={size} onPress={() => setViewer(item)} />
          )}
          ListEmptyComponent={
            <EmptyState
              icon={<CameraOff size={32} color="#9CA3AF" />}
              title="No photos yet"
              message="Moments from school life will appear here."
            />
          }
        />
      )}

      {/* Full-screen photo viewer */}
      <Modal visible={!!viewer} animationType="fade" transparent onRequestClose={() => setViewer(null)}>
        <View className="flex-1 bg-black/90">
          <View className="flex-row items-center justify-between px-4 pt-14">
            <Text className="flex-1 text-lg font-bold text-white" numberOfLines={1}>
              {viewer?.title}
            </Text>
            <Pressable onPress={() => setViewer(null)} hitSlop={10} className="p-2">
              <X size={24} color="#FFFFFF" />
            </Pressable>
          </View>
          {viewer ? (
            <Image
              source={{ uri: ik(viewer.imageUrl, 'w-1400') }}
              className="flex-1"
              contentFit="contain"
              transition={250}
            />
          ) : null}
          <View className="items-center pb-10">
            {viewer ? (
              <View className="rounded-full bg-white/10 px-4 py-1">
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
