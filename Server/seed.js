import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Bus from './models/Bus.js'; // ✅ Adjust the path as needed

dotenv.config();

const cities = [
  'Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune',
  'Ahmedabad', 'Jaipur', 'Bhopal', 'Indore', 'Kolkata', 'Lucknow'
];

const busCompanies = ['Red Express', 'Speedy Travels', 'TravelGo', 'National Bus Lines'];
const types = ['AC Sleeper', 'Non-AC Seater', 'AC Seater'];

// ⏱️ Helper: Generate time in 24-hr format
function getRandomHour(min = 5, max = 22) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatTime(hour, minute = 0) {
  const h = hour % 24;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const formattedHour = h % 12 === 0 ? 12 : h % 12;
  return `${formattedHour}:${minute === 0 ? '00' : '30'} ${ampm}`;
}

// ⏱️ Helper: Calculate duration between two hours
function calculateDuration(depHour, arrHour) {
  let diff = arrHour - depHour;
  if (diff <= 0) diff += 24;
  return `${diff}h`;
}

const generateSampleBuses = (count = 10) => {
  const buses = [];

  for (let i = 0; i < count; i++) {
    let from = cities[Math.floor(Math.random() * cities.length)];
    let to = cities[Math.floor(Math.random() * cities.length)];
    while (from === to) {
      to = cities[Math.floor(Math.random() * cities.length)];
    }

    const depHour = getRandomHour();
    const arrHour = (depHour + Math.floor(Math.random() * 6) + 2) % 24;

    const departureTime = formatTime(depHour);
    const arrivalTime = formatTime(arrHour);
    const duration = calculateDuration(depHour, arrHour);

    const totalSeats = Math.floor(Math.random() * 20) + 30; // 30 to 50 seats
    const seatData = Array.from({ length: totalSeats }, (_, i) => ({
      seat_id: i + 1,
      type: i % 3 === 0 ? 'window' : i % 3 === 1 ? 'side' : 'path',
      booked: false // ✅ initially all seats available
    }));

    buses.push({
      busId: `BUS${1000 + i}`,
      from,
      to,
      departureTime,
      arrivalTime,
      duration,
      availableSeats: totalSeats,
      price: Math.floor(Math.random() * 500) + 300, // ₹300 - ₹800
      originalPrice: Math.floor(Math.random() * 200) + 1000, // ₹1000 - ₹1200
      company: busCompanies[Math.floor(Math.random() * busCompanies.length)],
      busType: types[Math.floor(Math.random() * types.length)],
      rating: (Math.random() * 1.5 + 3.5).toFixed(1), // 3.5 to 5.0
      totalReview: Math.floor(Math.random() * 300) + 50,
      badges: [],
      seats: seatData,
      schedules: [{
        date: new Date(),
        availableSeats: totalSeats
      }]
    });
  }

  return buses;
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Bus.deleteMany(); // Optional: clear previous
    const buses = generateSampleBuses(20); // Adjust count if needed
    await Bus.insertMany(buses);
    console.log('✅ Sample buses seeded!');
    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error:', err.message);
    mongoose.disconnect();
  }
};

seedDatabase();
