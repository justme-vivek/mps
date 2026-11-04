import React from 'react';
import { FlatList, RefreshControl } from 'react-native';
import DataBoundary from '../feedback/DataBoundary';
import LoadMoreFooter from '../feedback/LoadMoreFooter';
import { ListCardSkeleton } from '../feedback/skeletons';
import { colors } from '../../theme/tokens';

/**
 * Admin CRUD list: virtualised FlatList + skeleton/error/empty states +
 * pull-to-refresh + lazy loading when `list` comes from useInfiniteList.
 * Works with a plain useQuery result too (no `loadMore` → no paging).
 */
export default function AdminList({ list, renderItem, empty, thumb = false, bottomPad = 120, skeleton: customSkeleton, ...rest }) {
  const paged = typeof list.loadMore === 'function';
  const skeleton = customSkeleton || <ListCardSkeleton count={4} thumb={thumb} />;

  return (
    <FlatList
      style={{ flex: 1 }}
      data={list.data || []}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      contentContainerStyle={{ paddingBottom: bottomPad }}
      showsVerticalScrollIndicator={false}
      {...rest}
      initialNumToRender={8}
      windowSize={7}
      removeClippedSubviews
      onEndReached={paged ? list.loadMore : undefined}
      onEndReachedThreshold={0.6}
      refreshControl={
        <RefreshControl
          refreshing={!!list.isRefetching && !list.isFetchingNextPage}
          onRefresh={list.refetch}
          tintColor={colors.pen}
        />
      }
      ListEmptyComponent={
        <DataBoundary query={{ ...list, data: undefined }} skeleton={skeleton} isEmpty={() => true} empty={empty}>
          {() => null}
        </DataBoundary>
      }
      ListFooterComponent={paged ? <LoadMoreFooter list={list} skeleton={<ListCardSkeleton count={2} thumb={thumb} />} /> : null}
    />
  );
}
