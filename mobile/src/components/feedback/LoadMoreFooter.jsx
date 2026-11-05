import React from 'react';
import { View } from 'react-native';
import Text from '../ui/Text';
import Button from '../ui/Button';
import ErrorState from './ErrorState';

/**
 * Footer for lazily loaded lists: shows `skeleton` while the next page loads,
 * a retry when that page failed, and a quiet "all caught up" at the end.
 */
export default function LoadMoreFooter({ list, skeleton, showEnd = true }) {
  if (list.isFetchingNextPage) return <View className="mt-3">{skeleton}</View>;
  if (list.isFetchNextPageError) {
    return (
      <View className="mt-4 items-center">
        <Text className="mb-2 text-[14px] text-ink-muted">Couldn't load more.</Text>
        <Button title="Try again" size="sm" variant="outline" onPress={() => list.fetchNextPage()} />
      </View>
    );
  }
  if (!list.hasNextPage && showEnd && (list.data?.length || 0) > 5) {
    return <Text className="mt-6 text-center text-[13px] text-ink-faint">You're all caught up</Text>;
  }
  return null;
}
