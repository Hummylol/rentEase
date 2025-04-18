import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { db } from '@/config/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

export default function ModeratorScreen() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [apartments, setApartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const vehiclesSnapshot = await getDocs(collection(db, 'vehicles'));
      const apartmentsSnapshot = await getDocs(collection(db, 'apartments'));
      
      setVehicles(vehiclesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setApartments(apartmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (collectionName: string, id: string) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
      if (collectionName === 'vehicles') {
        setVehicles(vehicles.filter(item => item.id !== id));
      } else {
        setApartments(apartments.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const handleItemPress = (type: string, id: string) => {
    if (type === 'vehicle') {
      router.push(`/vehicle/${id}`);
    } else {
      router.push(`/apartment/${id}`);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vehicles</Text>
        {vehicles.map((vehicle) => (
          <TouchableOpacity 
            key={vehicle.id} 
            style={styles.item}
            onPress={() => handleItemPress('vehicle', vehicle.id)}
          >
            <View style={styles.itemContent}>
              <Text style={styles.itemName}>{vehicle.name}</Text>
              <Text style={styles.itemType}>{vehicle.type}</Text>
            </View>
            <TouchableOpacity 
              onPress={() => handleDelete('vehicles', vehicle.id)}
              style={styles.deleteButton}
            >
              <Ionicons name="trash-outline" size={24} color="red" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Apartments</Text>
        {apartments.map((apartment) => (
          <TouchableOpacity 
            key={apartment.id} 
            style={styles.item}
            onPress={() => handleItemPress('apartment', apartment.id)}
          >
            <View style={styles.itemContent}>
              <Text style={styles.itemName}>{apartment.name}</Text>
              <Text style={styles.itemType}>Apartment</Text>
            </View>
            <TouchableOpacity 
              onPress={() => handleDelete('apartments', apartment.id)}
              style={styles.deleteButton}
            >
              <Ionicons name="trash-outline" size={24} color="red" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#192f6a',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#192f6a',
  },
  itemType: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  deleteButton: {
    padding: 8,
  },
}); 