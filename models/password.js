import bcryptjs from "bcryptjs";

async function hash(password) {
  const rounds = getNumberOfHashRounds();
  return await bcryptjs.hash(password, rounds);
}

function getNumberOfHashRounds() {
  const roundsInEnv = { production: 14, devOrStaging: 1 };

  return process.env.NODE_ENV === "production"
    ? roundsInEnv.production
    : roundsInEnv.devOrStaging;
}

async function compare(providedPassword, storedPassword) {
  return bcryptjs.compare(providedPassword, storedPassword);
}

const password = { hash, compare };

export default password;
