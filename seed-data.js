import { db } from './server/config/firebase.js';

const sampleItems = [
  {
    name: "Wireless Headphones",
    price: 350,
    category: "Electronics",
    description: "High-quality wireless headphones with noise cancellation",
    image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    name: "Cotton T-Shirt",
    price: 250,
    category: "Clothing",
    description: "Comfortable cotton t-shirt in various colors",
    image: "https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    name: "JavaScript Guide",
    price: 550,
    category: "Books",
    description: "Complete guide to modern JavaScript development",
    image: "https://images.pexels.com/photos/1907785/pexels-photo-1907785.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    name: "Coffee Maker",
    price: 450,
    category: "Home",
    description: "Programmable coffee maker with thermal carafe",
    image: "https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    name: "Running Shoes",
    price: 1200,
    category: "Sports",
    description: "Lightweight running shoes with advanced cushioning",
    image: "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    name: "Bluetooth Speaker",
    price: 495,
    category: "Electronics",
    description: "Portable Bluetooth speaker with excellent sound quality",
    image: "https://images.pexels.com/photos/1037992/pexels-photo-1037992.jpeg?auto=compress&cs=tinysrgb&w=300"
  }
];

async function seedData() {
  try {
    for (const item of sampleItems) {
      await db.collection('items').add({
        ...item,
        createdAt: new Date()
      });
    }
    console.log('Sample data added successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

seedData();