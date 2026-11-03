import React from 'react';
import { KeyboardAvoidingView, Modal, Platform, Text, View } from 'react-native';
import { X } from 'lucide-react-native';
import { Pressable } from 'react-native';
import Button from '../ui/Button';

/** Bottom-sheet style form modal used by all admin CRUD screens. */
export default function FormModal({ visible, title, onClose, onSubmit, submitLabel = 'Save', submitting = false, children }) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 justify-end bg-black/50">
        <Pressable className="flex-1" onPress={onClose} />
        <View className="rounded-t-3xl border-t border-line bg-surface px-5 pb-8 pt-3">
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="text-lg font-extrabold text-ink">{title}</Text>
            <Pressable onPress={onClose} hitSlop={10} className="p-1.5">
              <X size={22} color="#6B7280" />
            </Pressable>
          </View>
          <View style={{ maxHeight: 480 }}>{children}</View>
          <Button
            title={submitLabel}
            onPress={onSubmit}
            loading={submitting}
            className="mt-2"
            size="lg"
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
