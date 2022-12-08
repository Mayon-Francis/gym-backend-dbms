/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("trainers", {
    id: {
      type: "uuid",
      primaryKey: true,
    },
    name: {
      type: "varchar(100)",
      notNull: true,
    },
    password: {
      type: "varchar(100)",
      notNull: true,
    },
    email: {
      type: "varchar(100)",
      notNull: true,
      unique: true,
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    profile_image_url: {
      type: "varchar(200)",
    },
  });
};

exports.down = (pgm) => {};
