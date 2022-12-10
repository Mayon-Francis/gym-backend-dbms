/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addConstraint("workouts", "unique_workout_name_and_trainer_id", {
    unique: ["name", "trainer_id"],
  });
};

exports.down = (pgm) => {};
