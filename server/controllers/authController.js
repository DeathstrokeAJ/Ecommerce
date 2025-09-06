import bcrypt from 'bcryptjs';
import { db } from '../config/firebase.js';
import { generateToken } from '../utils/jwt.js';

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existingUsers = await db.collection('users').where('email', '==', email).get();

    if (!existingUsers.empty) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const docRef = await db.collection('users').add({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date()
    });

    const token = generateToken(docRef.id);

    res.status(201).json({
      token,
      user: { id: docRef.id, name, email }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userSnapshot = await db.collection('users').where('email', '==', email).get();

    if (userSnapshot.empty) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();

    const isPasswordValid = await bcrypt.compare(password, userData.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(userDoc.id);

    res.json({
      token,
      user: { id: userDoc.id, name: userData.name, email: userData.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
