require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL).then(async () => {
  await mongoose.connection.db.collection('users').updateMany({}, { $set: { isAdmin: true } });
  console.log('Successfully made all users Admin!');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
