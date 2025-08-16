import FontAwesome from '@expo/vector-icons/FontAwesome';
import { View } from 'react-native';
import { cn } from '../lib/utils';

export const TabBarIcon = ({
  name,
  color,
  size = 28,
  className,
}: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
  size?: number;
  className?: string;
}) => {
  return (
    <View className={cn('items-center justify-center', className)}>
      <FontAwesome 
        name={name} 
        color={color} 
        size={size} 
        style={{ marginBottom: -3 }}
      />
    </View>
  );
};
