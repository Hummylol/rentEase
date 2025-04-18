import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import AddVehicleForm from '@/components/AddVehicleForm';

export default function AddVehicleScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Add New Vehicle' }} />
      <View style={styles.container}>
        <AddVehicleForm />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
}); 