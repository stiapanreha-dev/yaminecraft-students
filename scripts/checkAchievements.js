import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const app = initializeApp({
  apiKey: 'AIzaSyD4hZAIr06lvMtSqhweF7bOP0CnnETQclo',
  authDomain: 'yaminecraft-students.firebaseapp.com',
  projectId: 'yaminecraft-students'
});

const db = getFirestore(app);

console.log('Checking achievements...\n');

const achievementsSnapshot = await getDocs(collection(db, 'achievements'));
console.log('Total achievements:', achievementsSnapshot.size);
console.log('');

if (achievementsSnapshot.size > 0) {
  achievementsSnapshot.forEach(doc => {
    const data = doc.data();
    console.log('---');
    console.log('Achievement ID:', doc.id);
    console.log('User ID:', data.userId);
    console.log('Title:', data.title);
    console.log('Category:', data.category);
    console.log('Points:', data.points);
    console.log('Date:', data.date);
  });
} else {
  console.log('No achievements found. Try adding an achievement from admin panel.');
}

process.exit(0);
