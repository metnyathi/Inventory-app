"use client";

import { Box, Button, Typography, TextField, IconButton, Paper } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDYA1gkD24h4AHvprXK95Y3tvC7AwsVdLw",
  authDomain: "pantrytracker-97712.firebaseapp.com",
  projectId: "pantrytracker-97712",
  storageBucket: "pantrytracker-97712.appspot.com",
  messagingSenderId: "608943234252",
  appId: "1:608943234252:web:3fb4e2501dc4ad19ce3669"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const Home = () => {
  const [inventory, setInventory] = useState<any[]>([]);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const updateInventory = async () => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      const snapShot = query(collection(db, 'inventory'));
      const docs = await getDocs(snapShot);
      const inventoryList = docs.docs.map(doc => ({
        name: doc.id,
        ...doc.data(),
      }));
      setInventory(inventoryList);
      setSuccessMessage('Inventory updated successfully.');
    } catch (err) {
      setError('Failed to fetch inventory.');
    } finally {
      setLoading(false);
    }
  }

  const adjustQuantity = async (name: string, change: number) => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      const docRef = doc(db, 'inventory', name);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const { quantity: currentQuantity } = docSnap.data();
        const newQuantity = currentQuantity + change;
        if (newQuantity <= 0) {
          await deleteDoc(docRef);
        } else {
          await setDoc(docRef, { quantity: newQuantity });
        }
        setSuccessMessage(`Item ${name} quantity adjusted successfully.`);
      } else if (change > 0) {
        await setDoc(docRef, { quantity: change });
        setSuccessMessage(`Item ${name} added successfully.`);
      } else {
        setError('Item not found.');
      }
      updateInventory();
    } catch (err) {
      setError('Failed to adjust item quantity.');
    } finally {
      setLoading(false);
    }
  }

  const setCustomQuantity = async (name: string, qty: number) => {
    if (!name.trim() || qty <= 0) {
      setError('Please enter a valid item name and quantity.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      const docRef = doc(db, 'inventory', name);
      await setDoc(docRef, { quantity: qty });
      setSuccessMessage('Item quantity set successfully.');
      updateInventory();
    } catch (err) {
      setError('Failed to set item quantity.');
    } finally {
      setLoading(false);
    }
  }

  const removeItem = async (name: string) => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      const docRef = doc(db, 'inventory', name);
      await deleteDoc(docRef);
      setSuccessMessage(`Item ${name} removed successfully.`);
      updateInventory();
    } catch (err) {
      setError('Failed to remove item.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    updateInventory();
  }, []);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      p={2}
      sx={{ backgroundColor: '#f5f5f5' }}
    >
      <Paper
        elevation={3}
        sx={{
          width: '500px',
          bgcolor: '#ADD8E6',
          p: 2,
          borderRadius: 2,
          overflow: 'auto',
          maxHeight: '400px',
          mb: 3
        }}
      >
        <Typography variant="h6" color="black" textAlign="center" fontSize="16px" fontWeight="bold">
          Inventory List
        </Typography>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          inventory.length > 0 ? (
            inventory.map((item) => (
              <Box key={item.name} mb={1} display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="body1" fontSize="14px" fontWeight="medium">{item.name}:</Typography>
                <Typography variant="body1" fontSize="14px" fontWeight="medium">{item.quantity}</Typography>
                <Box display="flex" flexDirection="row" alignItems="center">
                  <IconButton onClick={() => adjustQuantity(item.name, 1)} disabled={loading}>
                    <AddIcon color="primary" />
                  </IconButton>
                  <IconButton onClick={() => adjustQuantity(item.name, -1)} disabled={loading}>
                    <RemoveIcon color="error" />
                  </IconButton>
                </Box>
              </Box>
            ))
          ) : (
            <Typography>No items in inventory.</Typography>
          )
        )}
        {error && <Typography color="error">{error}</Typography>}
        {successMessage && <Typography color="success.main">{successMessage}</Typography>}
      </Paper>

      <Paper
        elevation={3}
        sx={{
          width: '500px',
          p: 3,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 2
        }}
      >
        <Typography variant="h6" color="primary" fontWeight="bold" mb={2}>
          Manage Inventory
        </Typography>
        <TextField
          label="Item Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          margin="normal"
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          margin="normal"
          fullWidth
          sx={{ mb: 2 }}
        />
        <Box display="flex" flexDirection="column" alignItems="center">
          <Button
            variant="contained"
            color="primary"
            onClick={() => setCustomQuantity(itemName, quantity)}
            disabled={loading}
            sx={{ mb: 1, width: '100%' }}
          >
            Add Item
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => removeItem(itemName)}
            disabled={loading}
            sx={{ width: '100%' }}
          >
            Remove Item
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Home;
