import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD4hZAIr06lvMtSqhweF7bOP0CnnETQclo",
  authDomain: "yaminecraft-students.firebaseapp.com",
  projectId: "yaminecraft-students",
  storageBucket: "yaminecraft-students.firebasestorage.app",
  messagingSenderId: "595423899305",
  appId: "1:595423899305:web:8e34452dc70f88b71f03b8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Admin credentials
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@yaminecraft.local';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123456';
const ADMIN_FIRST_NAME = process.env.ADMIN_FIRST_NAME || 'Администратор';
const ADMIN_LAST_NAME = process.env.ADMIN_LAST_NAME || 'Системы';

async function createAdmin() {
  try {
    console.log('Creating admin user...');

    // Create admin in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      ADMIN_EMAIL,
      ADMIN_PASSWORD
    );

    console.log('Admin user created in Firebase Auth:', userCredential.user.uid);

    // Create admin profile in Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email: ADMIN_EMAIL,
      role: 'admin',
      profile: {
        firstName: ADMIN_FIRST_NAME,
        lastName: ADMIN_LAST_NAME,
        middleName: '',
        birthDate: new Date('1990-01-01'),
        class: 'Admin',
        bio: 'Администратор системы',
        photoUrl: ''
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    console.log('Admin profile created in Firestore');
    console.log('\n=== Admin created successfully! ===');
    console.log('Email:', ADMIN_EMAIL);
    console.log('Password:', ADMIN_PASSWORD);
    console.log('UID:', userCredential.user.uid);
    console.log('\nYou can now login with these credentials.');

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();
