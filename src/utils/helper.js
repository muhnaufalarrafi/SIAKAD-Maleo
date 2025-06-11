// src\utils\helper.js
import bcrypt from 'bcrypt';

export function generate6DigitId() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function hashPassword(plain) {
  const saltRounds = 10;
  return await bcrypt.hash(plain, saltRounds);
}

export async function comparePassword(plain, hashed) {
  return await bcrypt.compare(plain, hashed);
}
