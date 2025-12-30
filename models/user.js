import database from "infra/database.js";
import password from "models/password.js";
import { ValidationError, NotFoundError } from "infra/errors.js";

async function create(userInputValues) {
  await validateUniqueUsername(userInputValues.username);
  await validadeUniqueEmail(userInputValues.email);
  await hashPasswordInObject(userInputValues);

  const newUser = await runInsertQuery(userInputValues);
  return newUser;

  async function runInsertQuery(userInputValues) {
    const result = await database.query({
      text: `
      INSERT INTO 
        users (username, email, password) 
      VALUES 
        ($1, $2, $3)
      RETURNING
        *
      ;`,
      values: [
        userInputValues.username,
        userInputValues.email,
        userInputValues.password,
      ],
    });

    return result.rows[0];
  }
}

async function findOneById(id) {
  const userFound = await runSelectQuery(id);

  return userFound;

  async function runSelectQuery(id) {
    const result = await database.query({
      text: `
      SELECT
        *
      FROM
        users
      WHERE
        id = $1
      LIMIT
        1
      ;`,
      values: [id],
    });

    if (result.rowCount === 0) {
      throw new NotFoundError({
        message: "The id provided was not found.",
        action: "Try a different id.",
      });
    }

    return result.rows[0];
  }
}

async function findOneByUsername(username) {
  const userFound = await runSelectQuery(username);

  return userFound;

  async function runSelectQuery(username) {
    const result = await database.query({
      text: `
      SELECT
        *
      FROM
        users
      WHERE
        LOWER(username) = LOWER($1)
      LIMIT
        1
      ;`,
      values: [username],
    });

    if (result.rowCount === 0) {
      throw new NotFoundError({
        message: "The username provided was not found.",
        action: "Try a different username.",
      });
    }

    return result.rows[0];
  }
}

async function findOneByEmail(email) {
  const userFound = await runSelectQuery(email);

  return userFound;

  async function runSelectQuery(email) {
    const result = await database.query({
      text: `
      SELECT
        *
      FROM
        users
      WHERE
        LOWER(email) = LOWER($1)
      LIMIT
        1
      ;`,
      values: [email],
    });

    if (result.rowCount === 0) {
      throw new NotFoundError({
        message: "The email provided was not found.",
        action: "Try a different email.",
      });
    }

    return result.rows[0];
  }
}

async function update(username, userInputValues) {
  const user = await findOneByUsername(username);

  if ("username" in userInputValues) {
    await validateUniqueUsername(userInputValues.username);
  }

  if ("email" in userInputValues) {
    await validadeUniqueEmail(userInputValues.email);
  }

  if ("password" in userInputValues) {
    await hashPasswordInObject(userInputValues);
  }

  const userWithNewValues = { ...user, ...userInputValues };

  const updatedUser = await runUpdateQuery(userWithNewValues);

  return updatedUser;

  async function runUpdateQuery(userWithNewValues) {
    const result = await database.query({
      text: `
        UPDATE
          users
        SET 
          username = $2,
          email = $3,
          password = $4,
          updated_at = timezone('utc', now())
        WHERE
          id = $1
        RETURNING
          *
      `,
      values: [
        userWithNewValues.id,
        userWithNewValues.username,
        userWithNewValues.email,
        userWithNewValues.password,
      ],
    });

    return result.rows[0];
  }
}

async function validateUniqueUsername(username) {
  const result = await database.query({
    text: `
      SELECT
        username
      FROM
        users
      WHERE
        LOWER(username) = LOWER($1)
      LIMIT
        1
      ;`,
    values: [username],
  });

  if (result.rowCount > 0) {
    throw new ValidationError({
      message: "The username provided is already in use.",
      action: "Please use a different username.",
    });
  }
}

async function validadeUniqueEmail(email) {
  const result = await database.query({
    text: `
      SELECT
        email
      FROM
        users
      WHERE
        LOWER(email) = LOWER($1)
      LIMIT
        1
      ;`,
    values: [email],
  });

  if (result.rowCount > 0) {
    throw new ValidationError({
      message: "The email address provided is already in use.",
      action: "Please use a different email.",
    });
  }
}

async function hashPasswordInObject(userInputValues) {
  const hashedPassword = await password.hash(userInputValues.password);

  userInputValues.password = hashedPassword;
}

const user = {
  create,
  findOneById,
  findOneByUsername,
  findOneByEmail,
  update,
};

export default user;
