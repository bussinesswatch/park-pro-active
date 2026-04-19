import { useState, useEffect, useCallback } from 'react';
import { db } from '../config/firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';

export const useCollection = (collectionName, options = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { where: whereClause, orderBy: orderByClause, realTime = true } = options;

  useEffect(() => {
    setLoading(true);
    let q = collection(db, collectionName);

    if (whereClause) {
      q = query(q, where(whereClause.field, whereClause.operator, whereClause.value));
    }

    if (orderByClause) {
      q = query(q, orderBy(orderByClause.field, orderByClause.direction || 'desc'));
    }

    if (realTime) {
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const items = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));
          setData(items);
          setLoading(false);
        },
        (err) => {
          setError(err.message);
          setLoading(false);
        }
      );
      return unsubscribe;
    } else {
      getDocs(q)
        .then((snapshot) => {
          const items = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));
          setData(items);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [collectionName, whereClause?.field, whereClause?.value, orderByClause?.field, realTime]);

  const addItem = useCallback(async (item) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...item,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { success: true, id: docRef.id };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [collectionName]);

  const updateItem = useCallback(async (id, updates) => {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [collectionName]);

  const deleteItem = useCallback(async (id) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [collectionName]);

  const refetch = useCallback(() => {
    setLoading(true);
    let q = collection(db, collectionName);
    if (whereClause) {
      q = query(q, where(whereClause.field, whereClause.operator, whereClause.value));
    }
    if (orderByClause) {
      q = query(q, orderBy(orderByClause.field, orderByClause.direction || 'desc'));
    }
    getDocs(q)
      .then((snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setData(items);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [collectionName, whereClause, orderByClause]);

  return { data, loading, error, addItem, updateItem, deleteItem, refetch };
};

export default useCollection;
