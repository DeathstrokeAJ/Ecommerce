import { db } from '../config/firebase.js';

export const getItems = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, sortBy = 'name' } = req.query;

    let q = db.collection('items');

    if (category) {
      q = q.where('category', '==', category);
    }

    const snapshot = await q.get();
    let items = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    if (minPrice || maxPrice) {
      items = items.filter(item => {
        const price = item.price;
        if (minPrice && price < parseFloat(minPrice)) return false;
        if (maxPrice && price > parseFloat(maxPrice)) return false;
        return true;
      });
    }

    items.sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const createItem = async (req, res) => {
  try {
    const { name, price, category, description, image } = req.body;

    const docRef = await db.collection('items').add({
      name,
      price: parseFloat(price),
      category,
      description,
      image,
      createdAt: new Date()
    });

    res.status(201).json({
      id: docRef.id,
      name,
      price: parseFloat(price),
      category,
      description,
      image
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category, description, image } = req.body;

    const itemRef = db.collection('items').doc(id);
    await itemRef.update({
      name,
      price: parseFloat(price),
      category,
      description,
      image,
      updatedAt: new Date()
    });

    res.json({ id, name, price: parseFloat(price), category, description, image });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    await db.collection('items').doc(id).delete();

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
