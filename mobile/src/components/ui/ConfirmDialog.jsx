import React from 'react';
import { Modal, View } from 'react-native';
import Text from './Text';
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
      <View className="flex-1 items-center justify-center bg-primary-900/60 px-6">
        <View className="w-full max-w-[420px] rounded-card border-[1.5px] border-line bg-surface p-6">
          <Text className="font-serif text-[22px] leading-7 text-ink">{title}</Text>
          {message ? <Text className="mt-2 text-[15px] leading-5 text-ink-soft">{message}</Text> : null}
          <View className="mt-5 flex-row" style={{ gap: 12 }}>
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
