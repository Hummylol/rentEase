import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { db } from '@/config/firebase';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '@/config/firebase';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function CarDetailScreen() {
  const { id } = useLocalSearchParams();
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  useEffect(() => {
    fetchCarDetails();
  }, [id]);

  const fetchCarDetails = async () => {
    try {
      const docRef = doc(db, 'vehicles', id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCar({ id: docSnap.id, ...docSnap.data() });
      }
    } catch (error) {
      console.error('Error fetching car details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    if (!auth.currentUser) {
      Alert.alert('Error', 'Please login to book this car');
      return;
    }

    try {
      const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const totalPrice = totalDays * car.price;

      await addDoc(collection(db, 'bookings'), {
        userId: auth.currentUser.uid,
        itemId: car.id,
        itemType: 'car',
        itemName: car.name,
        itemImage: car.image,
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

  if (!car) {
    return (
      <View style={styles.container}>
        <Text>Car not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: car.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{car.name}</Text>
        <Text style={styles.price}>₹{car.price}/day</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specifications</Text>
          <View style={styles.specsContainer}>
            <View style={styles.specItem}>
              <Ionicons name="car-outline" size={20} color="#4A659E" />
              <Text style={styles.specText}>{car.specs?.transmission || 'N/A'}</Text>
            </View>
            <View style={styles.specItem}>
              <Ionicons name="speedometer-outline" size={20} color="#4A659E" />
              <Text style={styles.specText}>{car.specs?.mileage || 'N/A'} kmpl</Text>
            </View>
            <View style={styles.specItem}>
              <Ionicons name="people-outline" size={20} color="#4A659E" />
              <Text style={styles.specText}>{car.specs?.seats || 'N/A'} seats</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Information</Text>
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Registration Status:</Text>
              <Text style={styles.infoValue}>{car.isRegistered ? 'Registered' : 'Not Registered'}</Text>
            </View>
            {car.problems && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Known Issues:</Text>
                <Text style={styles.infoValue}>{car.problems}</Text>
              </View>
            )}
            {car.extraFittings && car.extraFittings.length > 0 && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Extra Fittings:</Text>
                <Text style={styles.infoValue}>{car.extraFittings.join(', ')}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.contactContainer}>
            <Ionicons name="call-outline" size={20} color="#4A659E" />
            <Text style={styles.contactText}>{car.contactNumber}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Book This Car</Text>
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
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A659E',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    color: '#4CAF50',
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A659E',
    marginBottom: 12,
  },
  specsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  specText: {
    marginLeft: 8,
    color: '#666',
  },
  infoContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  infoItem: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A659E',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#666',
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
  },
  contactText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#4A659E',
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
}); 