const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('postgres', 'postgres.sfyccdpxlufqqijzgmhv', 'pavancharan@000', {
  host: 'aws-1-ap-southeast-1.pooler.supabase.com',
  port: 5432,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false
});

module.exports = { sequelize };
