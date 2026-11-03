import React from 'react';
import { Switch, Text, View } from 'react-native';

/** Labeled row wrapper for form controls. */
export function Field({ label, error, hint, children }) {
  return (
    <View className="mb-4">
      {label ? <Text className="mb-1.5 text-[13px] font-semibold text-ink-soft">{label}</Text> : null}
      {children}
      {hint && !error ? <Text className="mt-1 text-xs text-ink-faint">{hint}</Text> : null}
      {error ? <Text className="mt-1 text-xs text-danger">{error}</Text> : null}
    </View>
  );
}

/** Label + native switch row (used for boolean flags like isActive). */
export function SwitchRow({ label, value, onChange, description }) {
  return (
    <View className="mb-4 flex-row items-center justify-between rounded-2xl border border-line bg-surface px-4 py-3">
      <View className="flex-1 pr-3">
        <Text className="text-[14px] font-semibold text-ink">{label}</Text>
        {description ? <Text className="mt-0.5 text-xs text-ink-muted">{description}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: '#E5E7EB', true: '#4F46E5' }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}
