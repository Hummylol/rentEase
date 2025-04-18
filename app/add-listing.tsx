import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { db } from '@/config/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

export default function AddListingScreen() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    description: '',
    type: 'car',
    specs: {
      transmission: '',
      mileage: '',
      seats: '',
      fuelType: '',
      engine: '',
      type: '',
    },
    problems: '',
    isRegistered: false,
    extraFittings: [],
    contactNumber: '',
    // Apartment specific fields
    address: '',
    apartmentSpecs: {
      bedrooms: '',
      bathrooms: '',
      area: '',
      floor: '',
      furnished: false,
      parking: false,
      amenities: [],
    },
  });

  const handleSubmit = async () => {
    console.log('Form submitted with data:', formData);
    
    if (!formData.name || !formData.price || !formData.image || !formData.contactNumber) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      if (formData.type === 'apartment') {
        if (!formData.address || !formData.apartmentSpecs.area) {
          Alert.alert('Error', 'Please fill in address and area for apartments');
          return;
        }
        console.log('Adding apartment to Firestore...');
        const docRef = await addDoc(collection(db, 'apartments'), {
          name: formData.name,
          price: Number(formData.price),
          image: formData.image,
          description: formData.description,
          address: formData.address,
          contactNumber: formData.contactNumber,
          specs: {
            bedrooms: formData.apartmentSpecs.bedrooms || 'N/A',
            bathrooms: formData.apartmentSpecs.bathrooms || 'N/A',
            area: formData.apartmentSpecs.area,
            floor: formData.apartmentSpecs.floor || 'N/A',
            furnished: formData.apartmentSpecs.furnished,
            parking: formData.apartmentSpecs.parking,
            amenities: formData.apartmentSpecs.amenities,
          },
        });
        console.log('Apartment added with ID:', docRef.id);
      } else {
        if (!formData.specs.engine || !formData.specs.mileage) {
          Alert.alert('Error', 'Please fill in engine and mileage for vehicles');
          return;
        }
        console.log('Adding vehicle to Firestore...');
        const docRef = await addDoc(collection(db, 'vehicles'), {
          name: formData.name,
          price: Number(formData.price),
          image: formData.image,
          description: formData.description,
          type: formData.type,
          contactNumber: formData.contactNumber,
          problems: formData.problems,
          isRegistered: formData.isRegistered,
          extraFittings: formData.extraFittings,
          specs: {
            mileage: formData.specs.mileage,
            engine: formData.specs.engine,
            transmission: formData.specs.transmission || 'N/A',
            seats: formData.specs.seats || 'N/A',
            fuelType: formData.specs.fuelType || 'N/A',
            type: formData.specs.type || 'N/A',
          },
        });
        console.log('Vehicle added with ID:', docRef.id);
      }
      Alert.alert('Success', 'Listing added successfully');
      router.back();
    } catch (error) {
      console.error('Error adding listing:', error);
      Alert.alert('Error', 'Failed to add listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderApartmentFields = () => (
    <>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={formData.name}
        onChangeText={(text) => setFormData({ ...formData, name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Price per day"
        value={formData.price}
        onChangeText={(text) => setFormData({ ...formData, price: text })}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Image URL"
        value={formData.image}
        onChangeText={(text) => setFormData({ ...formData, image: text })}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description"
        value={formData.description}
        onChangeText={(text) => setFormData({ ...formData, description: text })}
        multiline
        numberOfLines={4}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={formData.address}
        onChangeText={(text) => setFormData({ ...formData, address: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Contact Number"
        value={formData.contactNumber}
        onChangeText={(text) => setFormData({ ...formData, contactNumber: text })}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Bedrooms"
        value={formData.apartmentSpecs.bedrooms}
        onChangeText={(text) => setFormData({ ...formData, apartmentSpecs: { ...formData.apartmentSpecs, bedrooms: text } })}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Bathrooms"
        value={formData.apartmentSpecs.bathrooms}
        onChangeText={(text) => setFormData({ ...formData, apartmentSpecs: { ...formData.apartmentSpecs, bathrooms: text } })}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Area (sqft)"
        value={formData.apartmentSpecs.area}
        onChangeText={(text) => setFormData({ ...formData, apartmentSpecs: { ...formData.apartmentSpecs, area: text } })}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Floor"
        value={formData.apartmentSpecs.floor}
        onChangeText={(text) => setFormData({ ...formData, apartmentSpecs: { ...formData.apartmentSpecs, floor: text } })}
        keyboardType="numeric"
      />
      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={[styles.checkbox, formData.apartmentSpecs.furnished && styles.checkboxChecked]}
          onPress={() => setFormData({ ...formData, apartmentSpecs: { ...formData.apartmentSpecs, furnished: !formData.apartmentSpecs.furnished } })}
        >
          {formData.apartmentSpecs.furnished && <Ionicons name="checkmark" size={16} color="white" />}
        </TouchableOpacity>
        <Text style={styles.checkboxLabel}>Furnished</Text>
      </View>
      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={[styles.checkbox, formData.apartmentSpecs.parking && styles.checkboxChecked]}
          onPress={() => setFormData({ ...formData, apartmentSpecs: { ...formData.apartmentSpecs, parking: !formData.apartmentSpecs.parking } })}
        >
          {formData.apartmentSpecs.parking && <Ionicons name="checkmark" size={16} color="white" />}
        </TouchableOpacity>
        <Text style={styles.checkboxLabel}>Parking Available</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Amenities (comma separated)"
        value={formData.apartmentSpecs.amenities.join(', ')}
        onChangeText={(text) => setFormData({ ...formData, apartmentSpecs: { ...formData.apartmentSpecs, amenities: text.split(',').map(item => item.trim()) } })}
      />
    </>
  );

  const renderVehicleFields = () => (
    <>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={formData.name}
        onChangeText={(text) => setFormData({ ...formData, name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Price per day"
        value={formData.price}
        onChangeText={(text) => setFormData({ ...formData, price: text })}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Image URL"
        value={formData.image}
        onChangeText={(text) => setFormData({ ...formData, image: text })}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description"
        value={formData.description}
        onChangeText={(text) => setFormData({ ...formData, description: text })}
        multiline
        numberOfLines={4}
      />
      <TextInput
        style={styles.input}
        placeholder="Contact Number"
        value={formData.contactNumber}
        onChangeText={(text) => setFormData({ ...formData, contactNumber: text })}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Problems (if any)"
        value={formData.problems}
        onChangeText={(text) => setFormData({ ...formData, problems: text })}
        multiline
      />
      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={[styles.checkbox, formData.isRegistered && styles.checkboxChecked]}
          onPress={() => setFormData({ ...formData, isRegistered: !formData.isRegistered })}
        >
          {formData.isRegistered && <Ionicons name="checkmark" size={16} color="white" />}
        </TouchableOpacity>
        <Text style={styles.checkboxLabel}>Vehicle is registered</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Extra fittings (comma separated)"
        value={formData.extraFittings.join(', ')}
        onChangeText={(text) => setFormData({ ...formData, extraFittings: text.split(',').map(item => item.trim()) })}
      />
      {formData.type === 'car' ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Transmission"
            value={formData.specs.transmission}
            onChangeText={(text) => setFormData({ ...formData, specs: { ...formData.specs, transmission: text } })}
          />
          <TextInput
            style={styles.input}
            placeholder="Mileage (kmpl)"
            value={formData.specs.mileage}
            onChangeText={(text) => setFormData({ ...formData, specs: { ...formData.specs, mileage: text } })}
          />
          <TextInput
            style={styles.input}
            placeholder="Number of seats"
            value={formData.specs.seats}
            onChangeText={(text) => setFormData({ ...formData, specs: { ...formData.specs, seats: text } })}
          />
          <TextInput
            style={styles.input}
            placeholder="Engine"
            value={formData.specs.engine}
            onChangeText={(text) => setFormData({ ...formData, specs: { ...formData.specs, engine: text } })}
          />
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Bike type"
            value={formData.specs.type}
            onChangeText={(text) => setFormData({ ...formData, specs: { ...formData.specs, type: text } })}
          />
          <TextInput
            style={styles.input}
            placeholder="Mileage (kmpl)"
            value={formData.specs.mileage}
            onChangeText={(text) => setFormData({ ...formData, specs: { ...formData.specs, mileage: text } })}
          />
          <TextInput
            style={styles.input}
            placeholder="Fuel type"
            value={formData.specs.fuelType}
            onChangeText={(text) => setFormData({ ...formData, specs: { ...formData.specs, fuelType: text } })}
          />
          <TextInput
            style={styles.input}
            placeholder="Engine"
            value={formData.specs.engine}
            onChangeText={(text) => setFormData({ ...formData, specs: { ...formData.specs, engine: text } })}
          />
        </>
      )}
    </>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Add New Listing</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Type</Text>
          <View style={styles.typeButtons}>
            <TouchableOpacity
              style={[styles.typeButton, formData.type === 'apartment' && styles.typeButtonActive]}
              onPress={() => setFormData({ ...formData, type: 'apartment' })}
            >
              <Text style={[styles.typeButtonText, formData.type === 'apartment' && styles.typeButtonTextActive]}>
                Apartment
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeButton, formData.type === 'car' && styles.typeButtonActive]}
              onPress={() => setFormData({ ...formData, type: 'car' })}
            >
              <Text style={[styles.typeButtonText, formData.type === 'car' && styles.typeButtonTextActive]}>
                Car
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeButton, formData.type === 'bike' && styles.typeButtonActive]}
              onPress={() => setFormData({ ...formData, type: 'bike' })}
            >
              <Text style={[styles.typeButtonText, formData.type === 'bike' && styles.typeButtonTextActive]}>
                Bike
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {formData.type === 'apartment' ? (
          renderApartmentFields()
        ) : (
          renderVehicleFields()
        )}

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Adding...' : 'Add Listing'}
          </Text>
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
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#192f6a',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#192f6a',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  typeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 4,
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#192f6a',
  },
  typeButtonText: {
    color: '#666666',
    fontSize: 16,
  },
  typeButtonTextActive: {
    color: 'white',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#4A659E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: '#4A659E',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#4A659E',
  },
  submitButton: {
    backgroundColor: '#192f6a',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
}); 