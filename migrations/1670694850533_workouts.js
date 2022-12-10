/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("workouts", {
    id: { type: "uuid", primaryKey: true },
    name: { type: "varchar(100)", notNull: true },
    part_of_body: { type: "varchar(100)", notNull: true },
    description: { type: "varchar(1000)" },
  });
};

exports.down = (pgm) => {};
