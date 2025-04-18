import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { CARS } from '@/data/cars';
import { BIKES } from '@/data/bikes';
import { Vehicle } from '@/types/rental';
import * as FileSystem from 'expo-file-system';

export default function AddVehicleForm() {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    type: '',
    specs: {
      engine: '',
      transmission: '',
      fuel: '',
    },
  });

  const handleSubmit = async () => {
    try {
      // Generate a new ID
      const newId = (Math.max(...[...CARS, ...BIKES].map(v => parseInt(v.id))) + 1).toString();
      
      // Create new vehicle object
      const newVehicle = {
        id: newId,
        ...formData,
      };

      // Read the current cars.ts file
      const carsPath = FileSystem.documentDirectory + '../data/cars.ts';
      const carsContent = await FileSystem.readAsStringAsync(carsPath);
      
      // Find the last item in the array
      const lastItemIndex = carsContent.lastIndexOf('},');
      const newContent = carsContent.slice(0, lastItemIndex + 2) + 
        `,\n  ${JSON.stringify(newVehicle, null, 2)}\n];`;
      
      // Write the updated content back to the file
      await FileSystem.writeAsStringAsync(carsPath, newContent);
      
      // Navigate back
      router.back();
    } catch (error) {
      console.error('Error adding vehicle:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Vehicle Name</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          placeholder="Enter vehicle name"
        />

        <Text style={styles.label}>Price per Day (₹)</Text>
        <TextInput
          style={styles.input}
          value={formData.price}
          onChangeText={(text) => setFormData({ ...formData, price: text })}
          placeholder="Enter price"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Image URL</Text>
        <TextInput
          style={styles.input}
          value={formData.image}
          onChangeText={(text) => setFormData({ ...formData, image: text })}
          placeholder="Enter image URL"
        />

        <Text style={styles.label}>Vehicle Type</Text>
        <TextInput
          style={styles.input}
          value={formData.type}
          onChangeText={(text) => setFormData({ ...formData, type: text })}
          placeholder="Enter vehicle type"
        />

        <Text style={styles.sectionTitle}>Specifications</Text>

        <Text style={styles.label}>Engine</Text>
        <TextInput
          style={styles.input}
          value={formData.specs.engine}
          onChangeText={(text) => setFormData({
            ...formData,
            specs: { ...formData.specs, engine: text }
          })}
          placeholder="Enter engine details"
        />

        <Text style={styles.label}>Transmission</Text>
        <TextInput
          style={styles.input}
          value={formData.specs.transmission}
          onChangeText={(text) => setFormData({
            ...formData,
            specs: { ...formData.specs, transmission: text }
          })}
          placeholder="Enter transmission type"
        />

        <Text style={styles.label}>Fuel Type</Text>
        <TextInput
          style={styles.input}
          value={formData.specs.fuel}
          onChangeText={(text) => setFormData({
            ...formData,
            specs: { ...formData.specs, fuel: text }
          })}
          placeholder="Enter fuel type"
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Add Vehicle</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#666666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#192f6a',
    marginTop: 16,
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#192f6a',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
}); 