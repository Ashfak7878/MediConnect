require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL).then(async () => {
  const db = mongoose.connection.db;
  const result = await db.collection('users').updateMany(
    { email: { $ne: 'admin@mediconnect.com' } },
    { $set: { isAdmin: false } }
  );
  
  console.log(`Updated ${result.modifiedCount} regular user accounts to isAdmin = false.`);
  const ashd = await db.collection('users').find({ email: { $ne: 'admin@mediconnect.com' } }).toArray();
  console.log('Regular users isAdmin flags:', ashd.map(u => `${u.email} -> isAdmin: ${u.isAdmin}`));

  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
