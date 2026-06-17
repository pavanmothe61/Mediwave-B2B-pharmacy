const { sequelize } = require('./config/database');
const User = require('./models/User');
const Medicine = require('./models/Medicine');
const Order = require('./models/Order');
const OrderItem = require('./models/OrderItem');

const initialMedicines = [
  { name: 'Paracetamol 500mg', description: 'Pain reliever and fever reducer.', price: 5.99, stock: 1500, category: 'Analgesics' },
  { name: 'Amoxicillin 250mg', description: 'Antibiotic for bacterial infections.', price: 12.50, stock: 800, category: 'Antibiotics' },
  { name: 'Ibuprofen 400mg', description: 'Nonsteroidal anti-inflammatory drug (NSAID).', price: 8.99, stock: 1200, category: 'NSAIDs' },
  { name: 'Cetirizine 10mg', description: 'Antihistamine for allergy relief.', price: 6.49, stock: 600, category: 'Antihistamines' },
  { name: 'Omeprazole 20mg', description: 'Reduces stomach acid.', price: 14.99, stock: 500, category: 'Antacids' },
  { name: 'Metformin 500mg', description: 'Used to treat type 2 diabetes.', price: 9.99, stock: 2000, category: 'Antidiabetics' },
  { name: 'Aspirin 75mg', description: 'Blood thinner and pain reliever. Currently facing supply shortages.', price: 4.50, stock: 0, category: 'Analgesics' },
  { name: 'Vitamin C 1000mg', description: 'Immunity booster. High demand item, temporarily unavailable.', price: 15.00, stock: 0, category: 'Vitamins' }
];

async function seedDatabase() {
  try {
    await sequelize.sync(); 

    const count = await Medicine.count();
    if (count === 0) {
      for (const med of initialMedicines) {
        await Medicine.create(med);
      }
      console.log('Database seeded with initial medicines successfully.');
    } else {
      console.log('Medicines already exist in the database.');
    }
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
