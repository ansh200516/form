// pages/api/auth/register.js
import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { kerberosId, password } = req.body;

  if (!kerberosId || !password) {
    return res.status(400).json({ message: 'Kerberos ID and password are required' });
  }

  await dbConnect();

  try {
    const existingUser = await User.findOne({ kerberosId });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    const user = await User.create({
      kerberosId,
      password: hashedPassword, // Save the hashed password
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}