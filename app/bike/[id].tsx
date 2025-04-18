import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { db, auth } from '@/config/firebase';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function BikeDetailScreen() {
  const { id } = useLocalSearchParams();
  const [bike, setBike] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBike();
    }
  }, [id]);

  const fetchBike = async () => {
    try {
      setLoading(true);
      setError(null);
      const docRef = doc(db, 'vehicles', id as string);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setBike({ id: docSnap.id, ...docSnap.data() });
      } else {
        setError('Bike not found');
      }
    } catch (error) {
      console.error('Error fetching bike:', error);
      setError('Failed to load bike details');
    } finally {
      setLoading(false);
    }
  };

  const handleCall = () => {
    if (bike?.contactNumber) {
      Linking.openURL(`tel:${bike.contactNumber}`);
    }
  };

  const handleBook = async () => {
    if (!auth.currentUser) {
      Alert.alert('Error', 'Please login to book this bike');
      return;
    }

    try {
      const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const totalPrice = totalDays * bike.price;

      await addDoc(collection(db, 'bookings'), {
        userId: auth.currentUser.uid,
        itemId: bike.id,
        itemType: 'bike',
        itemName: bike.name,
        itemImage: bike.image,
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
          onPress={fetchBike}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!bike) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Bike not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image 
        source={{ uri: bike.image }} 
        style={styles.image}
        resizeMode="cover"
      />
      
      <View style={styles.content}>
        <Text style={styles.name}>{bike.name}</Text>
        <Text style={styles.price}>₹{bike.price}/day</Text>
        
        <View style={styles.specsContainer}>
          <View style={styles.specItem}>
            <Ionicons name="bicycle-outline" size={24} color="#4A659E" />
            <Text style={styles.specValue}>{bike.specs.type}</Text>
            <Text style={styles.specLabel}>Type</Text>
          </View>
          <View style={styles.specItem}>
            <Ionicons name="speedometer-outline" size={24} color="#4A659E" />
            <Text style={styles.specValue}>{bike.specs.mileage}</Text>
            <Text style={styles.specLabel}>Mileage</Text>
          </View>
          <View style={styles.specItem}>
            <Ionicons name="flame-outline" size={24} color="#4A659E" />
            <Text style={styles.specValue}>{bike.specs.fuelType}</Text>
            <Text style={styles.specLabel}>Fuel</Text>
          </View>
        </View>

        {bike.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{bike.description}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Book This Bike</Text>
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
          <Text style={styles.contact}>{bike.contactNumber || 'Contact not available'}</Text>
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