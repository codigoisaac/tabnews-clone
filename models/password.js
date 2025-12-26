import bcryptjs from "bcryptjs";

async function hash(password) {
  const rounds = 14;
  return await bcryptjs.hash(password, rounds);
}

async function compare(providedPassword, storedPassword) {
  return bcryptjs.compare(providedPassword, storedPassword);
}

const password = { hash, compare };

export default password;
