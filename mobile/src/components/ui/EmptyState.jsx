import React from 'react';
import { Text, View } from 'react-native';

export default function EmptyState({ icon = null, title, message, actionLabel = null, onAction = null, Button = null }) {
  return (
    <View className="items-center rounded-3xl border border-dashed border-line bg-surface px-8 py-12">
      {icon}
      <Text className="mt-3 text-center text-base font-bold text-ink">{title}</Text>
      {message ? <Text className="mt-1 text-center text-sm text-ink-muted">{message}</Text> : null}
      {actionLabel && onAction && Button ? (
        <Button title={actionLabel} onPress={onAction} size="sm" className="mt-4" />
      ) : null}
    </View>
  );
}
