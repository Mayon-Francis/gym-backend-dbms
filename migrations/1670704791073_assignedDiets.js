/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("assigned_diets", {
    id: {
      type: "uuid",
      primaryKey: true,
    },
    diet_id: {
      type: "uuid",
      notNull: true,
      references: '"diets"',
      onDelete: "cascade",
    },
    user_id: {
      type: "uuid",
      notNull: true,
      references: '"users"',
      onDelete: "cascade",
    },
    no_of_times: {
      type: "varchar(100)",
    },
    time: {
      type: "varchar(100)",
    },
  });
};

exports.down = (pgm) => {};
