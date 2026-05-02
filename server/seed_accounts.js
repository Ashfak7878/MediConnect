require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect(process.env.MONGO_URL).then(async () => {
  try {
    const db = mongoose.connection.db;
    const salt = await bcrypt.genSalt(10);

    console.log('--- STARTING ACCOUNT CREATION ---');
    const adminEmail = 'admin@mediconnect.com';
    const adminPassword = 'admin123';
    const hashedAdminPassword = await bcrypt.hash(adminPassword, salt);
    await db.collection('users').deleteOne({ email: adminEmail });

    const adminResult = await db.collection('users').insertOne({
      name: 'System Admin',
      email: adminEmail,
      password: hashedAdminPassword,
      isAdmin: true,
      isDoctor: false,
      notification: [],
      seennotification: []
    });
    console.log(`✅ Admin created with email: ${adminEmail} | password: ${adminPassword}`);
    const doctorEmail = 'doctor@mediconnect.com';
    const doctorPassword = 'doctor123';
    const hashedDoctorPassword = await bcrypt.hash(doctorPassword, salt);
    await db.collection('users').deleteOne({ email: doctorEmail });
    await db.collection('doctors').deleteOne({ email: doctorEmail });

    const userResult = await db.collection('users').insertOne({
      name: 'Dr. Sarah',
      email: doctorEmail,
      password: hashedDoctorPassword,
      isAdmin: false,
      isDoctor: true,   // VERY IMPORTANT: Set isDoctor to true
      notification: [],
      seennotification: []
    });

    const doctorUserId = userResult.insertedId;
    await db.collection('doctors').insertOne({
      userId: doctorUserId.toString(), // Mongoose schemas often use String for userId referencing
      firstName: 'Sarah',
      lastName: 'Smith',
      phone: '9876543210',
      email: doctorEmail,
      website: 'www.sarahsmith.com',
      address: '123 Medical Avenue, NY',
      specialization: 'Neurologist',
      experience: '8',
      feesPerCunsaltation: 800,
      timings: ['09:00', '17:00'],
      status: 'approved' // VERY IMPORTANT: Pre-approve the doctor
    });
    console.log(`✅ Doctor fully configured with email: ${doctorEmail} | password: ${doctorPassword}`);

    console.log('--- DB SEEDING COMPLETE ---');
    process.exit(0);

  } catch (err) {
    console.error('Error during seeding:', err);
    process.exit(1);
  }
}).catch(err => {
  console.error("MongoDB Connection Error:", err);
  process.exit(1);
});
