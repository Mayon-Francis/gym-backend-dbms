/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("assigned_workouts", {
    id: { type: "uuid", primaryKey: true },
    user_id: {
      type: "uuid",
      notNull: true,
      references: "users",
      onDelete: "cascade",
    },
    workout_id: {
      type: "uuid",
      notNull: true,
      references: "workouts",
      onDelete: "cascade",
    },
    date: { type: "date" },
    completed: { type: "boolean", notNull: true, default: false },
    sets: { type: "integer" },
    reps: { type: "integer" },
  });
};

exports.down = (pgm) => {};
