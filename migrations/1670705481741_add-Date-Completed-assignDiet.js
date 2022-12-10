/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns("assigned_diets", {
    date: {
      type: "date",
      notNull: true,
      default: pgm.func("current_date"),
    },
    completed: {
      type: "boolean",
      notNull: true,
      default: false,
    },
  });
};

exports.down = (pgm) => {};
