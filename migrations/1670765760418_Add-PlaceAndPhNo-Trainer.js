/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addColumns("trainers", {
        place: {
            type: "varchar(255)",
            default: "Kakkanad"
        },
        phone_number: {
            type: "varchar(255)",
            default: "+911234567890"
        }
    });
};

exports.down = pgm => {};
