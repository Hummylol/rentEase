import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Vehicle } from '@/types/index';
import { Home, Bath, Maximize } from 'lucide-react-native';

interface ApartmentCardProps {
  apartment: Vehicle;
  onPress?: () => void;
}

export default function ApartmentCard({ apartment, onPress }: ApartmentCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: apartment.image }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{apartment.name}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>₹{apartment.price}</Text>
            <Text style={styles.perDay}>/day</Text>
          </View>
        </View>

        <Text style={styles.type}>{apartment.type}</Text>

        <View style={styles.features}>
          <View style={styles.feature}>
            <Home size={16} color="#192f6a" />
            <Text style={styles.featureText}>{apartment.specs.bedrooms} Beds</Text>
          </View>
          <View style={styles.feature}>
            <Bath size={16} color="#192f6a" />
            <Text style={styles.featureText}>{apartment.specs.bathrooms} Baths</Text>
          </View>
          <View style={styles.feature}>
            <Maximize size={16} color="#192f6a" />
            <Text style={styles.featureText}>{apartment.specs.area}</Text>
          </View>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {apartment.description}
        </Text>
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
  content: {
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  name: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    color: '#192f6a',
    flex: 1,
    marginRight: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: '#192f6a',
  },
  perDay: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#666666',
    marginLeft: 4,
  },
  type: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#666666',
    marginBottom: 12,
  },
  features: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 16,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#192f6a',
    marginLeft: 4,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#666666',
  },
});