/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("diets", {
    id: {
      type: "uuid",
      primaryKey: true,
    },
    name: {
      type: "varchar(100)",
      notNull: true,
    },
    protein: {
      type: "varchar(100)",
    },
    quantity: {
      type: "varchar(100)",
    },
    trainer_id: {
      type: "uuid",
      notNull: true,
      references: '"trainers"',
      onDelete: "cascade",
    },
  });
};

exports.down = (pgm) => {};
