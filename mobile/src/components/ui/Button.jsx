import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

const VARIANTS = {
  primary: 'bg-primary-600 border border-primary-600',
  outline: 'bg-surface border border-line',
  ghost: 'bg-transparent border border-transparent',
  danger: 'bg-danger border border-danger',
  soft: 'bg-primary-50 border border-primary-100',
};

const TEXTS = {
  primary: 'text-white',
  outline: 'text-ink',
  ghost: 'text-primary-600',
  danger: 'text-white',
  soft: 'text-primary-700',
};

const SIZES = {
  sm: 'h-9 px-4 rounded-xl',
  md: 'h-12 px-5 rounded-2xl',
  lg: 'h-14 px-6 rounded-2xl',
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
  children,
}) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={({ pressed }) =>
        `flex-row items-center justify-center active:opacity-80 ${VARIANTS[variant]} ${SIZES[size]} ${isDisabled ? 'opacity-60' : ''} ${className}`
      }
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'danger' ? '#FFFFFF' : '#4F46E5'}
        />
      ) : (
        <View className="flex-row items-center">
          {icon}
          {title ? (
            <Text className={`font-semibold ${TEXTS[variant]} ${TEXT_SIZES[size]} ${icon ? 'ml-2' : ''}`}>
              {title}
            </Text>
          ) : null}
          {children}
        </View>
      )}
    </Pressable>
  );
}
