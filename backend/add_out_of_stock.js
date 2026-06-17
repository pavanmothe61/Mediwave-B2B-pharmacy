const { sequelize } = require('./config/database');
const Medicine = require('./models/Medicine');

async function run() {
  await sequelize.sync();
  await Medicine.create({
    name: 'Aspirin 75mg',
    description: 'Blood thinner and pain reliever. Currently facing supply shortages.',
    price: 4.50,
    stock: 0,
    category: 'Analgesics'
  });
  await Medicine.create({
    name: 'Vitamin C 1000mg',
    description: 'Immunity booster. High demand item, temporarily unavailable.',
    price: 15.00,
    stock: 0,
    category: 'Vitamins'
  });
  console.log("Added out of stock items");
  process.exit(0);
}
run();
