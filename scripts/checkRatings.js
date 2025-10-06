import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const app = initializeApp({
  apiKey: 'AIzaSyD4hZAIr06lvMtSqhweF7bOP0CnnETQclo',
  authDomain: 'yaminecraft-students.firebaseapp.com',
  projectId: 'yaminecraft-students'
});

const db = getFirestore(app);

const ratingsSnapshot = await getDocs(collection(db, 'ratings'));
console.log('Total ratings:', ratingsSnapshot.size);
console.log('');

ratingsSnapshot.forEach(doc => {
  const data = doc.data();
  console.log('---');
  console.log('User ID:', doc.id);
  console.log('Total points:', data.totalPoints);
  console.log('Month points:', data.monthPoints);
  console.log('Year points:', data.yearPoints);
});

if (ratingsSnapshot.size === 0) {
  console.log('No ratings found. Ratings need to be created for students.');
}

process.exit(0);
