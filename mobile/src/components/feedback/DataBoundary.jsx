import React from 'react';
import { View } from 'react-native';
import EmptyState from '../ui/EmptyState';
import Text from '../ui/Text';
import ErrorState from './ErrorState';
import { useNetwork } from '../../services/network';

/**
 * One wrapper for every data-driven section:
 *   first load  → `skeleton` (screen-shaped placeholder, never a spinner)
 *   failed      → ErrorState with Retry (only when there is nothing cached to show)
 *   empty       → `empty` node (or default EmptyState props)
 *   data        → children(data)
 * Cached data keeps showing while refetching; a slow-connection hint appears
 * under the skeleton so the wait never feels frozen.
 */
export default function DataBoundary({
  query,
  skeleton,
  empty = { title: 'Nothing here yet' },
  isEmpty = (d) => !d || (Array.isArray(d) && d.length === 0),
  children,
}) {
  const { slow, online } = useNetwork();
  const { data, isPending, isError, error, refetch, isRefetching } = query;

  if (isPending && !data) {
    return (
      <View>
        {skeleton}
        {slow || !online ? (
          <Text className="mt-3 text-center text-[13px] text-ink-muted" accessibilityLiveRegion="polite">
            {online ? 'Slow connection — still loading…' : 'Waiting for connection…'}
          </Text>
        ) : null}
      </View>
    );
  }

  if (isError && !data) return <ErrorState error={error} onRetry={refetch} retrying={isRefetching} />;

  if (isEmpty(data)) return React.isValidElement(empty) ? empty : <EmptyState {...empty} />;

  return children(data);
}
