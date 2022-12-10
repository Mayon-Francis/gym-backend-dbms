/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumn("workouts", {
    trainer_id: {
      type: "uuid",
      notNull: true,
      references: "trainers",
      onDelete: "cascade",
    },
  });
};

exports.down = (pgm) => {};
