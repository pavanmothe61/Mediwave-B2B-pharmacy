const { sequelize } = require('./config/database');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Medicine = require('./models/Medicine');

async function seed() {
  try {
    await sequelize.sync();
    
    // Create admin user
    const hash = await bcrypt.hash('admin123', 10);
    const [admin] = await User.findOrCreate({
      where: { email: 'admin@admin.com' },
      defaults: {
        password_hash: hash,
        role: 'admin',
        name: 'System Admin'
      }
    });
    
    // Create medicines if none exist
    const count = await Medicine.count();
    if (count === 0) {
      await Medicine.bulkCreate([
        { name: 'Paracetamol 500mg', description: 'Pain reliever and fever reducer.', price: 15.50, stock: 500, category: 'General' },
        { name: 'Amoxicillin 250mg', description: 'Antibiotic used to treat bacterial infections.', price: 45.00, stock: 0, category: 'Antibiotics' },
        { name: 'Cetirizine 10mg', description: 'Antihistamine for allergy relief.', price: 22.00, stock: 200, category: 'Allergy' },
        { name: 'Vitamin C 1000mg', description: 'Immune system support supplement.', price: 120.00, stock: 150, category: 'Vitamins' }
      ]);
    }
    
    console.log('Supabase successfully seeded!');
    process.exit(0);
  } catch(err) {
    console.error(err);
    process.exit(1);
  }
}
seed();
