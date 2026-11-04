import React from 'react';
import { Switch, View } from 'react-native';
import Text from '../ui/Text';
import { colors } from '../../theme/tokens';

/** Labeled row wrapper for form controls. */
export function Field({ label, error, hint, children }) {
  return (
    <View className="mb-4">
      {label ? <Text className="mb-1.5 text-[14px] font-bold text-ink-soft">{label}</Text> : null}
      {children}
      {hint && !error ? <Text className="mt-1 text-[13px] text-ink-muted">{hint}</Text> : null}
      {error ? <Text className="mt-1 text-[13px] text-danger">{error}</Text> : null}
    </View>
  );
}

/** Label + native switch row (used for boolean flags like isActive). */
export function SwitchRow({ label, value, onChange, description }) {
  return (
    <View className="mb-4 min-h-[56px] flex-row items-center justify-between rounded-2xl border-[1.5px] border-line bg-surface px-4 py-3">
      <View className="flex-1 pr-3">
        <Text className="text-[15px] font-bold text-ink">{label}</Text>
        {description ? <Text className="mt-0.5 text-[13px] text-ink-muted">{description}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        accessibilityLabel={label}
        trackColor={{ false: colors.line, true: colors.pen }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}
