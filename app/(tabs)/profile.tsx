import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { router } from 'expo-router';
import { User, Plus, Shield } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const maskPassword = (email: string | null | undefined) => {
    if (!email) return '';
    const [username, domain] = email.split('@');
    if (!username || !domain) return email;
    const maskedUsername = username.slice(0, 4) + '*'.repeat(Math.max(0, username.length - 4));
    return `${maskedUsername}@${domain}`;
  };

  // For testing purposes, let's make the moderator button always visible
  const isModerator = user?.email === 'sethu@gmail.com' || user?.email === 'chidhu@gmail.com' || user?.email === 'a@gmail.com';

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.header}
      >
        <View style={styles.avatarContainer}>
          <User size={50} color="#ffffff" />
        </View>
        <Text style={styles.name}>{user?.displayName || 'User'}</Text>
        <Text style={styles.email}>{maskPassword(user?.email || '')}</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{maskPassword(user?.email || '')}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Account Type</Text>
            <Text style={styles.value}>{isModerator ? 'Moderator' : 'Standard'}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Member Since</Text>
            <Text style={styles.value}>
              {user?.metadata.creationTime
                ? new Date(user.metadata.creationTime).toLocaleDateString()
                : 'N/A'}
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/add-listing')}
        >
          <Plus size={20} color="#192f6a" />
          <Text style={styles.actionButtonText}>Add New Listing</Text>
        </TouchableOpacity>

        {isModerator && (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/moderator')}
          >
            <Shield size={20} color="#192f6a" />
            <Text style={styles.actionButtonText}>Moderator View</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
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
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#ffffff',
    opacity: 0.8,
  },
  content: {
    padding: 20,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#192f6a',
    marginBottom: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#666666',
  },
  value: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#192f6a',
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  actionButtonText: {
    color: '#192f6a',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    marginLeft: 8,
  },
}); 