/**
 * Seed script: creates demo doctors (one per category), demo patient, and demo appointments.
 * Run: npm run seed   (from Server folder)
 *
 * Demo credentials:
 *   Doctor  - Email: demo@doctor.com   Password: Demo@123
 *   Patient - Email: demo@patient.com  Password: Demo@123
 */
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Doctor from './models/doctor.model.js';
import { Patient } from './models/patient.model.js';
import Appointment from './models/appointment.model.js';
import { healthcareCategoriesList } from './constant.js';

const DEMO_PASSWORD = 'Demo@123';

const defaultDailyTimeRanges = [
  { start: '09:00', end: '12:00' },
  { start: '14:00', end: '17:00' },
];

const DEMO_DOCTORS = [
  {
    name: 'Dr. Sarah Smith',
    email: 'demo@doctor.com',
    specialisation: 'Cardiologist',
    category: 'Primary Care',
    qualification: 'MD, MBBS, DM (Cardiology)',
    experience: 12,
    about: 'Experienced cardiologist specializing in preventive care and chronic disease management.',
    fees: 500,
    hospitalInfo: { name: 'City General Hospital', address: '123 Medical Complex', city: 'Mumbai' },
    dailyTimeRanges: defaultDailyTimeRanges,
    slotDurationInMinutes: 30,
    isVerified: true,
  },
  {
    name: 'Dr. Raj Kumar',
    email: 'demo2@doctor.com',
    specialisation: 'Neurologist',
    category: 'Manage Your Condition',
    qualification: 'MD, DM (Neurology)',
    experience: 10,
    about: 'Specialist in chronic condition management and neurology.',
    fees: 600,
    hospitalInfo: { name: 'Neuro Care Center', address: '456 Health Ave', city: 'Delhi' },
    dailyTimeRanges: defaultDailyTimeRanges,
    slotDurationInMinutes: 30,
    isVerified: true,
  },
  {
    name: 'Dr. Priya Sharma',
    email: 'demo3@doctor.com',
    specialisation: 'Physichrist',
    category: 'Mental & Behavioral Health',
    qualification: 'MD (Psychiatry), MBBS',
    experience: 8,
    about: 'Mental health and behavioral therapy expert.',
    fees: 550,
    hospitalInfo: { name: 'Mind Wellness Clinic', address: '789 Peace Road', city: 'Bangalore' },
    dailyTimeRanges: defaultDailyTimeRanges,
    slotDurationInMinutes: 30,
    isVerified: true,
  },
  {
    name: 'Dr. Amit Patel',
    email: 'demo4@doctor.com',
    specialisation: 'General Physians',
    category: 'Sexual Health',
    qualification: 'MBBS, MD (General Medicine)',
    experience: 9,
    about: 'General physician with focus on sexual health and wellness.',
    fees: 450,
    hospitalInfo: { name: 'Family Health Hub', address: '321 Care Lane', city: 'Chennai' },
    dailyTimeRanges: defaultDailyTimeRanges,
    slotDurationInMinutes: 30,
    isVerified: true,
  },
  {
    name: 'Dr. Sneha Reddy',
    email: 'demo5@doctor.com',
    specialisation: 'permiadictrician',
    category: "Children's Health",
    qualification: 'MBBS, DCH, MD (Pediatrics)',
    experience: 11,
    about: 'Pediatrician specializing in children\'s health and development.',
    fees: 500,
    hospitalInfo: { name: 'Kids Care Hospital', address: '555 Child Street', city: 'Hyderabad' },
    dailyTimeRanges: defaultDailyTimeRanges,
    slotDurationInMinutes: 30,
    isVerified: true,
  },
  {
    name: 'Dr. Vikram Singh',
    email: 'demo6@doctor.com',
    specialisation: 'gercimologist',
    category: 'Senior Health',
    qualification: 'MBBS, MD (Geriatrics)',
    experience: 14,
    about: 'Geriatric care and senior health specialist.',
    fees: 550,
    hospitalInfo: { name: 'Senior Wellness Center', address: '777 Elder Care Ave', city: 'Pune' },
    dailyTimeRanges: defaultDailyTimeRanges,
    slotDurationInMinutes: 30,
    isVerified: true,
  },
  {
    name: 'Dr. Anjali Desai',
    email: 'demo7@doctor.com',
    specialisation: 'General Physians',
    category: "Women's Health",
    qualification: 'MBBS, MD (Obstetrics & Gynecology)',
    experience: 13,
    about: 'Women\'s health and wellness consultations.',
    fees: 520,
    hospitalInfo: { name: 'Women\'s Health Clinic', address: '888 Wellness Blvd', city: 'Mumbai' },
    dailyTimeRanges: defaultDailyTimeRanges,
    slotDurationInMinutes: 30,
    isVerified: true,
  },
  {
    name: 'Dr. Karan Mehta',
    email: 'demo8@doctor.com',
    specialisation: 'General Physians',
    category: 'Wellness',
    qualification: 'MBBS, MD (Preventive Medicine)',
    experience: 7,
    about: 'Preventive care and general wellness consultant.',
    fees: 400,
    hospitalInfo: { name: 'Wellness First Clinic', address: '999 Fit Road', city: 'Kolkata' },
    dailyTimeRanges: defaultDailyTimeRanges,
    slotDurationInMinutes: 30,
    isVerified: true,
  },
];

const DEMO_PATIENT = {
  name: 'Alex Johnson',
  email: 'demo@patient.com',
  password: null,
  phoneNumber: '9876543210',
  gender: 'Male',
  bloodGroup: 'O+',
  isVerified: true,
};

function makeZegoRoomId() {
  return `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function addDays(d, days) {
  const out = new Date(d);
  out.setDate(out.getDate() + days);
  return out;
}

function slotAt(date, hour, minute, durationMinutes = 30) {
  const start = new Date(date);
  start.setHours(hour, minute, 0, 0);
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
  return { start, end };
}

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI not set in .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);

  try {
    // Ensure we have enough demo doctors (one per category)
    const categories = [...healthcareCategoriesList];
    const doctorsToUpsert = DEMO_DOCTORS.slice(0, categories.length);

    const savedDoctors = [];
    for (let i = 0; i < doctorsToUpsert.length; i++) {
      const doc = doctorsToUpsert[i];
      const payload = { ...doc, password: hashedPassword };
      const doctor = await Doctor.findOneAndUpdate(
        { email: doc.email },
        { $set: payload },
        { new: true, upsert: true }
      );
      savedDoctors.push(doctor);
      console.log(`✅ Demo doctor [${doc.category}]: ${doctor.email}`);
    }

    // Upsert demo patient
    const patientPayload = { ...DEMO_PATIENT, password: hashedPassword };
    const patient = await Patient.findOneAndUpdate(
      { email: DEMO_PATIENT.email },
      { $set: patientPayload },
      { new: true, upsert: true }
    );
    console.log('✅ Demo patient ready:', patient.email);

    // Create at least 2 appointments per category (per doctor)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let appointmentCount = 0;
    for (let d = 0; d < savedDoctors.length; d++) {
      const doctor = savedDoctors[d];
      const category = doctor.category;

      for (let a = 0; a < 2; a++) {
        const isPast = a === 0; // first appointment past, second upcoming
        const day = addDays(today, isPast ? -(d * 2 + a + 1) : (d * 2 + a + 1));
        const { start, end } = slotAt(day, 9 + a, 0, 30);

        const existing = await Appointment.findOne({
          doctorId: doctor._id,
          patientId: patient._id,
          slotStartIso: start,
        });
        if (existing) continue;

        await Appointment.create({
          doctorId: doctor._id,
          patientId: patient._id,
          date: day,
          slotStartIso: start,
          slotEndIso: end,
          consultationType: a === 0 ? 'Video Consultation' : 'Voice Call',
          status: isPast ? 'Completed' : 'Scheduled',
          symptoms: `Demo consultation for ${category} - symptoms description for the visit.`,
          zegoRoomId: makeZegoRoomId(),
          prescription: isPast ? `Prescription for ${category} visit: Follow-up in 2 weeks.` : '',
          notes: isPast ? 'Demo visit completed.' : '',
          consultationFees: doctor.fees,
          platformFees: 0,
          totalAmount: doctor.fees,
          paymentStatus: isPast ? 'Paid' : 'Pending',
          payoutStatus: isPast ? 'Pending' : 'Pending',
        });
        appointmentCount++;
      }
    }

    console.log(`✅ Created ${appointmentCount} demo appointments (2 per category)`);

    console.log('\n--- Demo login (for interview) ---');
    console.log('Doctor  → Email: demo@doctor.com   Password: Demo@123');
    console.log('Patient → Email: demo@patient.com  Password: Demo@123');
    console.log('-----------------------------------\n');
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
    process.exit(0);
  }
}

seed();
