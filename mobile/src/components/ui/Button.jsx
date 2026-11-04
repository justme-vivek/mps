import React from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import Text from './Text';

const VARIANTS = {
  primary: 'bg-primary border border-primary',
  outline: 'bg-surface border-[1.5px] border-line',
  ghost: 'bg-transparent border border-transparent',
  danger: 'bg-danger border border-danger',
  soft: 'bg-primary-50 border border-primary-100',
};

const TEXTS = {
  primary: 'text-white',
  outline: 'text-ink',
  ghost: 'text-primary',
  danger: 'text-white',
  soft: 'text-primary-700',
};

// Minimum 44px tap target on every size.
const SIZES = {
  sm: 'min-h-[44px] px-4 rounded-xl',
  md: 'min-h-[48px] px-5 rounded-xl',
  lg: 'min-h-[56px] px-6 rounded-2xl',
};

const TEXT_SIZES = { sm: 'text-sm', md: 'text-[15px]', lg: 'text-base' };

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon = null,
  className = '',
  accessibilityLabel,
  children,
}) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      className={`flex-row items-center justify-center active:opacity-80 ${VARIANTS[variant]} ${SIZES[size]} ${
        isDisabled ? 'opacity-60' : ''
      } ${className}`}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'danger' ? '#FFFFFF' : '#2A44B8'}
        />
      ) : (
        <View className="flex-row items-center">
          {icon}
          {title ? (
            <Text className={`font-bold ${TEXTS[variant]} ${TEXT_SIZES[size]} ${icon ? 'ml-2' : ''}`}>
              {title}
            </Text>
          ) : null}
          {children}
        </View>
      )}
    </Pressable>
  );
}
