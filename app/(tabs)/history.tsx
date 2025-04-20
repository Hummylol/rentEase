import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { db } from '@/config/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { BookingHistory } from '@/types/rental';

export default function HistoryScreen() {
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const bookingsRef = collection(db, 'bookings');
      const querySnapshot = await getDocs(bookingsRef);
      const bookingsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as BookingHistory));
      setBookings(bookingsData);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch bookings');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  const handleDelete = async (bookingId: string) => {
    try {
      setBookings(prevBookings => {
        const updatedBookings = prevBookings.filter(booking => booking.id !== bookingId);
        return updatedBookings;
      });

      const bookingRef = doc(db, 'bookings', bookingId);
      await deleteDoc(bookingRef);
      Alert.alert('Success', 'Booking deleted successfully');
    } catch (error) {
      fetchBookings();
      Alert.alert('Error', 'Failed to delete booking. Please try again.');
    }
  };

  const confirmDelete = (bookingId: string) => {
    Alert.alert(
      'Delete Booking',
      'Are you sure you want to delete this booking?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => handleDelete(bookingId)
        }
      ],
      { cancelable: true }
    );
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return '#FFA500';
      case 'confirmed':
        return '#4CAF50';
      case 'completed':
        return '#2196F3';
      case 'cancelled':
        return '#F44336';
      default:
        return '#666';
    }
  };

  const renderBookingCard = ({ item }: { item: BookingHistory }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.itemImage }} style={styles.image} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.title}>{item.itemName}</Text>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => confirmDelete(item.id)}
          >
            <Ionicons name="trash-outline" size={24} color="#F44336" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.datesContainer}>
          <View style={styles.dateItem}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.dateText}>Start: {new Date(item.startDate).toLocaleDateString()}</Text>
          </View>
          <View style={styles.dateItem}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.dateText}>End: {new Date(item.endDate).toLocaleDateString()}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
          <Text style={styles.price}>₹{item.totalPrice?.toLocaleString() || '0'}</Text>
        </View>
      </View>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Booking History</Text>
          <Text style={styles.headerSubtitle}>View and manage your bookings</Text>
        </View>
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <Ionicons name="refresh" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={bookings}
        renderItem={renderBookingCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#4A659E',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  refreshButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    marginLeft: 16,
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A659E',
    flex: 1,
  },
  deleteButton: {
    padding: 8,
  },
  datesContainer: {
    marginBottom: 12,
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dateText: {
    marginLeft: 8,
    color: '#666',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
}); 