import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import * as Linking from 'expo-linking';

export default function VehicleDetailScreen() {
  const { id } = useLocalSearchParams();
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicle();
  }, [id]);

  const fetchVehicle = async () => {
    try {
      const docRef = doc(db, 'vehicles', id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setVehicle({ id: docSnap.id, ...docSnap.data() });
      }
    } catch (error) {
      console.error('Error fetching vehicle:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = () => {
    if (vehicle?.contactNumber) {
      Linking.openURL(`tel:${vehicle.contactNumber}`);
    }
  };

  const handleBookNow = () => {
    // This will be implemented later
    console.log('Booking vehicle:', vehicle?.id);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!vehicle) {
    return (
      <View style={styles.container}>
        <Text>Vehicle not found</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: vehicle.name }} />
      <ScrollView style={styles.container}>
        <Image 
          source={{ uri: vehicle.image }} 
          style={styles.image}
          resizeMode="cover"
        />
        
        <View style={styles.content}>
          <Text style={styles.name}>{vehicle.name}</Text>
          <Text style={styles.price}>₹{vehicle.price}/day</Text>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Specifications</Text>
            <View style={styles.specs}>
              <View style={styles.specItem}>
                <Ionicons name="speedometer-outline" size={24} color="#192f6a" />
                <Text style={styles.specText}>{vehicle.specs?.mileage || 'N/A'}</Text>
              </View>
              <View style={styles.specItem}>
                <Ionicons name="car-outline" size={24} color="#192f6a" />
                <Text style={styles.specText}>{vehicle.specs?.transmission || 'N/A'}</Text>
              </View>
              <View style={styles.specItem}>
                <Ionicons name="people-outline" size={24} color="#192f6a" />
                <Text style={styles.specText}>{vehicle.specs?.seats || 'N/A'} seats</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <Text style={styles.address}>{vehicle.address || 'Location not specified'}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Condition</Text>
            <Text style={styles.condition}>{vehicle.condition || 'Condition not specified'}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact</Text>
            <Text style={styles.contact}>{vehicle.contactNumber || 'Contact not available'}</Text>
            <TouchableOpacity 
              style={styles.callButton}
              onPress={handleCall}
            >
              <Ionicons name="call-outline" size={24} color="white" />
              <Text style={styles.callButtonText}>Call Now</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.bookButton}
            onPress={handleBookNow}
          >
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#192f6a',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    color: '#4CAF50',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#192f6a',
    marginBottom: 10,
  },
  specs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  specItem: {
    alignItems: 'center',
  },
  specText: {
    marginTop: 8,
    color: '#666',
  },
  address: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  condition: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  contact: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  callButtonText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  bookButton: {
    backgroundColor: '#192f6a',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
}); 