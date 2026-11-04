import React from 'react';
import { View } from 'react-native';
import Text from './Text';

/** An empty screen is an invitation: say what is missing and what to do. */
export default function EmptyState({ icon = null, title, message, actionLabel = null, onAction = null, Button = null }) {
  return (
    <View className="items-center rounded-card border-[1.5px] border-dashed border-line bg-surface px-8 py-12">
      {icon}
      <Text className="mt-3 text-center font-serif text-xl text-ink">{title}</Text>
      {message ? <Text className="mt-1 text-center text-[15px] text-ink-muted">{message}</Text> : null}
      {actionLabel && onAction && Button ? (
        <Button title={actionLabel} onPress={onAction} size="sm" className="mt-4" />
      ) : null}
    </View>
  );
}
