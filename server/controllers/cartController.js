import { db } from '../config/firebase.js';

export const getCart = async (req, res) => {
  try {
    const userId = req.userId;

    const snapshot = await db.collection('cart').where('userId', '==', userId).get();

    const cartItems = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { itemId, quantity = 1 } = req.body;
    const userId = req.userId;

    const existingItems = await db.collection('cart').where('userId', '==', userId).where('itemId', '==', itemId).get();

    if (!existingItems.empty) {
      const existingItem = existingItems.docs[0];
      const currentQuantity = existingItem.data().quantity;

      await db.collection('cart').doc(existingItem.id).update({
        quantity: currentQuantity + quantity
      });

      res.json({ message: 'Item quantity updated in cart' });
    } else {
      const docRef = await db.collection('cart').add({
        userId,
        itemId,
        quantity,
        createdAt: new Date()
      });

      res.status(201).json({
        id: docRef.id,
        userId,
        itemId,
        quantity
      });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const userId = req.userId;

    if (quantity <= 0) {
      await db.collection('cart').doc(id).delete();
      res.json({ message: 'Item removed from cart' });
    } else {
      await db.collection('cart').doc(id).update({ quantity });
      res.json({ message: 'Cart item updated' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;

    await db.collection('cart').doc(id).delete();

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
