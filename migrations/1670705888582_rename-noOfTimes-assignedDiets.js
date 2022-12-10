/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.renameColumn("assigned_diets", "noOfTimes", "no_of_times");
};

exports.down = pgm => {};
