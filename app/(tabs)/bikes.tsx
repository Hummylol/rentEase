import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { db } from '@/config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { Vehicle } from '@/types/rental';

export default function BikesScreen() {
  const router = useRouter();
  const [bikes, setBikes] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchBikes();
  }, []);

  const fetchBikes = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'vehicles'));
      const bikesData = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Vehicle))
        .filter(vehicle => vehicle.type === 'bike');
      setBikes(bikesData);
    } catch (error) {
      console.error('Error fetching bikes:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchBikes();
  };

  const renderBikeCard = ({ item }: { item: Vehicle }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/bike/${item.id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.price}>₹{item.price}/day</Text>
        
        <View style={styles.specsContainer}>
          <View style={styles.specItem}>
            <Ionicons name="bicycle-outline" size={20} color="#666" />
            <Text style={styles.specText}>{item.specs?.type || 'N/A'}</Text>
          </View>
          <View style={styles.specItem}>
            <Ionicons name="speedometer-outline" size={20} color="#666" />
            <Text style={styles.specText}>{item.specs?.mileage || 'N/A'} kmpl</Text>
          </View>
          <View style={styles.specItem}>
            <Ionicons name="battery-charging-outline" size={20} color="#666" />
            <Text style={styles.specText}>{item.specs?.fuelType || 'N/A'}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
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
          <Text style={styles.headerTitle}>Ride in Style</Text>
          <Text style={styles.headerSubtitle}>Find your perfect two-wheeled companion</Text>
        </View>
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <Ionicons name="refresh" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={bikes}
        renderItem={renderBikeCard}
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A659E',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    color: '#4CAF50',
    marginBottom: 12,
  },
  specsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 8,
  },
  specText: {
    marginLeft: 4,
    color: '#666',
    fontSize: 14,
  },
});