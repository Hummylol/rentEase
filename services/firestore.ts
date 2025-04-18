import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';

export const addVehicle = async (vehicle: any) => {
  try {
    const docRef = await addDoc(collection(db, 'vehicles'), {
      ...vehicle,
      createdAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding vehicle:', error);
    throw error;
  }
};

export const getVehicles = async (type: 'car' | 'bike') => {
  try {
    const querySnapshot = await getDocs(collection(db, 'vehicles'));
    return querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(vehicle => vehicle.type === type);
  } catch (error) {
    console.error('Error getting vehicles:', error);
    throw error;
  }
};

export const addApartment = async (apartment: any) => {
  try {
    const docRef = await addDoc(collection(db, 'apartments'), {
      ...apartment,
      createdAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding apartment:', error);
    throw error;
  }
};

export const getApartments = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'apartments'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting apartments:', error);
    throw error;
  }
};

export const deleteItem = async (collectionName: string, id: string) => {
  try {
    await deleteDoc(doc(db, collectionName, id));
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
}; 