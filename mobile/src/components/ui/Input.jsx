import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';

/**
 * Labeled text input with error display and password visibility toggle.
 * Controlled — pair with react-hook-form's Controller.
 */
export default function Input({ label, error, secure = false, className = '', ...props }) {
  const [hidden, setHidden] = useState(secure);
  return (
    <View className={`mb-4 ${className}`}>
      {label ? <Text className="mb-1.5 text-[13px] font-semibold text-ink-soft">{label}</Text> : null}
      <View
        className={`flex-row items-center rounded-2xl border bg-surface px-4 ${
          error ? 'border-danger' : 'border-line'
        }`}
      >
        <TextInput
          className="h-12 flex-1 text-[15px] text-ink"
          placeholderTextColor="#9CA3AF"
          secureTextEntry={hidden}
          {...props}
        />
        {secure ? (
          <TouchableOpacity onPress={() => setHidden((h) => !h)} className="p-1">
            {hidden ? <Eye size={20} color="#6B7280" /> : <EyeOff size={20} color="#6B7280" />}
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? <Text className="mt-1.5 text-xs text-danger">{error}</Text> : null}
    </View>
  );
}
