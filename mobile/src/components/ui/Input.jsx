import React, { useState } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import Text from './Text';
import { Eye, EyeOff } from 'lucide-react-native';
import { colors } from '../../theme/tokens';

/**
 * Labeled text input with error display and password visibility toggle.
 * Controlled — pair with react-hook-form's Controller.
 */
export default function Input({ label, error, secure = false, className = '', onFocus, onBlur, ...props }) {
  const [hidden, setHidden] = useState(secure);
  const [focused, setFocused] = useState(false);
  const border = error ? 'border-danger' : focused ? 'border-primary' : 'border-line';
  return (
    <View className={`mb-4 ${className}`}>
      {label ? <Text className="mb-1.5 text-[14px] font-bold text-ink-soft">{label}</Text> : null}
      <View className={`flex-row items-center rounded-xl border-[1.5px] bg-surface px-4 ${border}`}>
        <TextInput
          className="font-sans h-12 flex-1 text-[16px] text-ink"
          placeholderTextColor={colors.inkFaint}
          secureTextEntry={hidden}
          accessibilityLabel={label}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />
        {secure ? (
          <TouchableOpacity
            onPress={() => setHidden((h) => !h)}
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
            className="h-11 w-11 items-center justify-center"
          >
            {hidden ? <Eye size={20} color={colors.inkMuted} /> : <EyeOff size={20} color={colors.inkMuted} />}
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? <Text className="mt-1.5 text-[13px] text-danger">{error}</Text> : null}
    </View>
  );
}
