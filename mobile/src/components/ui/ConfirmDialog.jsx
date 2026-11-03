import React from 'react';
import { Modal, Text, View } from 'react-native';
import Button from './Button';

export default function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = 'Confirm',
  danger = false,
  loading = false,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
      <View className="flex-1 items-center justify-center bg-black/50 px-8">
        <View className="w-full rounded-3xl bg-surface p-6">
          <Text className="text-lg font-extrabold text-ink">{title}</Text>
          {message ? <Text className="mt-1.5 text-sm text-ink-muted">{message}</Text> : null}
          <View className="mt-5 flex-row space-x-3">
            <View className="flex-1">
              <Button title="Cancel" variant="outline" onPress={onCancel} disabled={loading} />
            </View>
            <View className="flex-1">
              <Button
                title={confirmLabel}
                variant={danger ? 'danger' : 'primary'}
                onPress={onConfirm}
                loading={loading}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
