import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc } from 'firebase/firestore';

const app = initializeApp({
  apiKey: 'AIzaSyD4hZAIr06lvMtSqhweF7bOP0CnnETQclo',
  authDomain: 'yaminecraft-students.firebaseapp.com',
  projectId: 'yaminecraft-students'
});

const db = getFirestore(app);

console.log('Recalculating all ratings from achievements...\n');

// Получаем все достижения
const achievementsSnapshot = await getDocs(collection(db, 'achievements'));
console.log('Total achievements found:', achievementsSnapshot.size);

// Группируем достижения по пользователям
const userAchievements = {};

achievementsSnapshot.forEach(doc => {
  const data = doc.data();
  if (!data.userId) {
    console.log('Warning: Achievement without userId:', doc.id);
    return;
  }

  if (!userAchievements[data.userId]) {
    userAchievements[data.userId] = [];
  }

  userAchievements[data.userId].push({
    id: doc.id,
    ...data
  });
});

console.log('Users with achievements:', Object.keys(userAchievements).length);
console.log('');

// Подсчитываем рейтинги для каждого пользователя
const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth();

for (const [userId, achievements] of Object.entries(userAchievements)) {
  let totalPoints = 0;
  let yearPoints = 0;
  let monthPoints = 0;
  const breakdown = {
    sport: 0,
    study: 0,
    creativity: 0,
    volunteer: 0
  };

  achievements.forEach(achievement => {
    const points = achievement.points || 0;
    totalPoints += points;

    // Добавляем в breakdown по категории
    if (breakdown.hasOwnProperty(achievement.category)) {
      breakdown[achievement.category] += points;
    }

    // Проверяем дату для year/month points
    const achievementDate = achievement.date?.toDate?.() || new Date(achievement.date);
    const achievementYear = achievementDate.getFullYear();
    const achievementMonth = achievementDate.getMonth();

    if (achievementYear === currentYear) {
      yearPoints += points;

      if (achievementMonth === currentMonth) {
        monthPoints += points;
      }
    }
  });

  // Сохраняем рейтинг
  const rating = {
    userId,
    totalPoints,
    yearPoints,
    monthPoints,
    breakdown,
    lastUpdated: new Date()
  };

  await setDoc(doc(db, 'ratings', userId), rating);

  console.log(`User ${userId}:`);
  console.log(`  Total: ${totalPoints} points`);
  console.log(`  Year: ${yearPoints} points`);
  console.log(`  Month: ${monthPoints} points`);
  console.log(`  Breakdown:`, breakdown);
  console.log('');
}

console.log('Ratings recalculated successfully!');
process.exit(0);
