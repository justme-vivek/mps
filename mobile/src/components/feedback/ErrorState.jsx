import React from 'react';
import { View } from 'react-native';
import { ServerCrash, WifiOff } from 'lucide-react-native';
import Text from '../ui/Text';
import Button from '../ui/Button';
import { colors } from '../../theme/tokens';
import { useNetwork } from '../../services/network';
import { isNetworkError } from '../../services/api';

/**
 * Friendly failure panel with a Retry action. Distinguishes "you are offline /
 * can't reach us" from a genuine server error so the advice is right.
 */
export default function ErrorState({ error, onRetry, retrying = false, compact = false }) {
  const { online } = useNetwork();
  const network = !online || isNetworkError(error);
  const Icon = network ? WifiOff : ServerCrash;

  return (
    <View
      accessibilityRole="alert"
      className={`items-center rounded-card border-[1.5px] border-dashed border-line bg-surface px-8 ${compact ? 'py-8' : 'py-12'}`}
    >
      <View className="h-14 w-14 items-center justify-center rounded-full bg-primary-50">
        <Icon size={26} color={colors.pen} />
      </View>
      <Text className="mt-3 text-center font-serif text-xl text-ink">
        {network ? "You're offline" : 'Something went wrong'}
      </Text>
      <Text className="mt-1 text-center text-[15px] text-ink-muted">
        {network
          ? "We can't reach the school server. Check your connection — we'll refresh by ourselves when you're back."
          : 'The server had a problem loading this. Please try again in a moment.'}
      </Text>
      {onRetry ? <Button title="Try again" onPress={onRetry} loading={retrying} size="sm" className="mt-5" /> : null}
    </View>
  );
}
