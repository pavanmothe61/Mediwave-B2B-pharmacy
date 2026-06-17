const express = require('express');
const cors = require('cors');
const { sequelize } = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const medicineRoutes = require('./routes/medicineRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.get('/', (req, res) => res.send('Pharmacy B2B Backend API is successfully running!'));

const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
  console.log('Database synced successfully');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.error('Error syncing database:', err));
