import { forwardRef } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Pressable, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../contexts/authContext';

export const HeaderButton = forwardRef<typeof Pressable, { onPress?: () => void }>(
	({ onPress }, ref) => {
		const { signOut } = useAuth();

		const handlePress = async () => {
			try {
				await signOut();
			} catch (error: any) {
				Alert.alert('Error', error.message);
			}
		};

		return (
			<Pressable onPress={handlePress}>
				{({ pressed }) => (
					<FontAwesome
						name="sign-out"
						size={25}
						color="#FF3B30"
						style={[
							styles.headerRight,
							{
								opacity: pressed ? 0.5 : 1,
							},
						]}
					/>
				)}
			</Pressable>
		);
	}
);

HeaderButton.displayName = 'HeaderButton';

export const styles = StyleSheet.create({
	headerRight: {
		marginRight: 15,
	},
});
