const bcrypt = require('bcryptjs');
const { sequelize } = require('./config/database');
const User = require('./models/User');

async function createAdmin() {
  try {
    await sequelize.sync();
    const email = 'admin@admin.com';
    const existing = await User.findOne({ where: { email } });
    
    if (existing) {
      console.log('Admin account already exists.');
      process.exit(0);
    }
    
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash('admin123', salt);
    
    await User.create({
      email,
      password_hash,
      role: 'admin',
      name: 'System Administrator'
    });
    
    console.log('Default Admin user created successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err);
    process.exit(1);
  }
}

createAdmin();
