exports.up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },

    username: {
      type: "varchar(32)",
      // For reference, GitHub uses 39 as username character limit,
      // Reddit uses 20, Discord uses 32, Twitter/X uses 15...
      notNull: true,
      unique: true,
    },

    email: {
      type: "varchar(254)",
      // Why 254 in length? https://stackoverflow.com/a/1199238
      notNull: true,
      unique: true,
    },

    password: {
      // bcrypt hash will always be 60 characters long:
      // https://www.npmjs.com/package/bcryptjs
      type: "varchar(60)",
      notNull: true,
    },

    created_at: {
      // Why timestamp with timezone?
      // https://justatheory.com/2012/04/postgres-use-timestamptz
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
    },

    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
    },
  });
};

exports.down = false;
