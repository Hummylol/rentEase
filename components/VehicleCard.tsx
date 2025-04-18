import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Vehicle } from '@/types/rental';

interface VehicleCardProps {
  vehicle: Vehicle;
  onPress?: () => void;
}

export default function VehicleCard({ vehicle, onPress }: VehicleCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: vehicle.image }} style={styles.image} />
      <View style={styles.info}>
        <View>
          <Text style={styles.name}>{vehicle.name}</Text>
          <Text style={styles.type}>{vehicle.type}</Text>
          {vehicle.specs && (
            <View style={styles.specs}>
              {Object.entries(vehicle.specs).map(([key, value]) => (
                <Text key={key} style={styles.spec}>
                  {key}: {value}
                </Text>
              ))}
            </View>
          )}
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>₹{vehicle.price}</Text>
          <Text style={styles.perDay}>/day</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 200,
  },
  info: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  name: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#192f6a',
  },
  type: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#666666',
    marginTop: 4,
  },
  specs: {
    marginTop: 8,
  },
  spec: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#666666',
    marginTop: 2,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: '#192f6a',
  },
  perDay: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#666666',
    marginLeft: 4,
  },
});