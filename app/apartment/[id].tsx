import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { db, auth } from '@/config/firebase';
import * as Linking from 'expo-linking';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function ApartmentDetailScreen() {
  const { id } = useLocalSearchParams();
  const [apartment, setApartment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  useEffect(() => {
    if (id) {
      fetchApartment();
    }
  }, [id]);

  const fetchApartment = async () => {
    try {
      setLoading(true);
      setError(null);
      const docRef = doc(db, 'apartments', id as string);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setApartment({ id: docSnap.id, ...docSnap.data() });
      } else {
        setError('Apartment not found');
      }
    } catch (error) {
      console.error('Error fetching apartment:', error);
      setError('Failed to load apartment details');
    } finally {
      setLoading(false);
    }
  };

  const handleCall = () => {
    if (apartment?.contactNumber) {
      Linking.openURL(`tel:${apartment.contactNumber}`);
    }
  };

  const handleBook = async () => {
    if (!auth.currentUser) {
      Alert.alert('Error', 'Please login to book this apartment');
      return;
    }

    try {
      const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const totalPrice = totalDays * apartment.price;

      await addDoc(collection(db, 'bookings'), {
        userId: auth.currentUser.uid,
        itemId: apartment.id,
        itemType: 'apartment',
        itemName: apartment.name,
        itemImage: apartment.image,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        totalPrice,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });

      Alert.alert('Success', 'Booking request sent successfully');
      router.push('/history');
    } catch (error) {
      console.error('Error creating booking:', error);
      Alert.alert('Error', 'Failed to create booking');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchApartment}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!apartment) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Apartment not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image 
        source={{ uri: apartment.image }} 
        style={styles.image}
        resizeMode="cover"
      />
      
      <View style={styles.content}>
        <Text style={styles.name}>{apartment.name}</Text>
        <Text style={styles.price}>₹{apartment.price}/month</Text>
        
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={20} color="#666" />
          <Text style={styles.location}>{apartment.address}</Text>
        </View>

        <View style={styles.specsContainer}>
          <View style={styles.specItem}>
            <Ionicons name="bed-outline" size={24} color="#4A659E" />
            <Text style={styles.specValue}>{apartment.specs.bedrooms}</Text>
            <Text style={styles.specLabel}>Bedrooms</Text>
          </View>
          <View style={styles.specItem}>
            <Ionicons name="water-outline" size={24} color="#4A659E" />
            <Text style={styles.specValue}>{apartment.specs.bathrooms}</Text>
            <Text style={styles.specLabel}>Bathrooms</Text>
          </View>
          <View style={styles.specItem}>
            <Ionicons name="resize-outline" size={24} color="#4A659E" />
            <Text style={styles.specValue}>{apartment.specs.area}</Text>
            <Text style={styles.specLabel}>sq ft</Text>
          </View>
        </View>

        {apartment.amenities && apartment.amenities.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesContainer}>
              {apartment.amenities.map((amenity: string, index: number) => (
                <View key={index} style={styles.amenityItem}>
                  <Ionicons name="checkmark-circle-outline" size={20} color="#4A659E" />
                  <Text style={styles.amenityText}>{amenity}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {apartment.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{apartment.description}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Book This Apartment</Text>
          <View style={styles.bookingContainer}>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowStartDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color="#4A659E" />
              <Text style={styles.dateButtonText}>
                Start Date: {startDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowEndDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color="#4A659E" />
              <Text style={styles.dateButtonText}>
                End Date: {endDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bookButton}
              onPress={handleBook}
            >
              <Text style={styles.bookButtonText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <Text style={styles.contact}>{apartment.contactNumber || 'Contact not available'}</Text>
          <TouchableOpacity 
            style={styles.callButton}
            onPress={handleCall}
          >
            <Ionicons name="call-outline" size={24} color="white" />
            <Text style={styles.callButtonText}>Call Now</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowStartDatePicker(false);
            if (selectedDate) {
              setStartDate(selectedDate);
            }
          }}
        />
      )}

      {showEndDatePicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowEndDatePicker(false);
            if (selectedDate) {
              setEndDate(selectedDate);
            }
          }}
        />
      )}
    </ScrollView>
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
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  location: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  specsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  specItem: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  specLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  specValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#192f6a',
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
  description: {
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
  bookingContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  dateButtonText: {
    marginLeft: 8,
    color: '#4A659E',
    fontSize: 16,
  },
  bookButton: {
    backgroundColor: '#4A659E',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  amenitiesContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  amenityText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#4A659E',
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#4A659E',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 