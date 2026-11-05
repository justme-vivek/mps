import React from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, View } from 'react-native';
import { X } from 'lucide-react-native';
import Text from '../ui/Text';
import Button from '../ui/Button';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { colors } from '../../theme/tokens';

/**
 * Form modal used by all admin CRUD screens.
 * Phones: bottom sheet. Tablets and laptops: centred 560px dialog.
 */
export default function FormModal({ visible, title, onClose, onSubmit, submitLabel = 'Save', submitting = false, children }) {
  const { isMedium, height } = useBreakpoint();
  return (
    <Modal visible={visible} animationType={isMedium ? 'fade' : 'slide'} transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className={`flex-1 bg-primary-900/60 ${isMedium ? 'items-center justify-center px-6' : 'justify-end'}`}
      >
        {!isMedium ? <Pressable className="flex-1" onPress={onClose} accessibilityLabel="Close form" /> : null}
        <View
          className={`w-full border-line bg-surface px-5 pb-6 pt-4 ${
            isMedium ? 'max-w-[560px] rounded-card border-[1.5px]' : 'rounded-t-[28px] border-t-[1.5px]'
          }`}
        >
          <View className="mb-2 flex-row items-center justify-between">
            <Text accessibilityRole="header" className="font-serif text-[22px] text-ink">
              {title}
            </Text>
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close"
              className="h-11 w-11 items-center justify-center"
            >
              <X size={22} color={colors.inkMuted} />
            </Pressable>
          </View>
          <View style={{ maxHeight: Math.min(480, Math.max(240, height - 260)) }}>{children}</View>
          <Button title={submitLabel} onPress={onSubmit} loading={submitting} className="mt-2" size="lg" />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
