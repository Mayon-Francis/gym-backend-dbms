/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable("admins", {
        id: {
            type: "uuid",
            primaryKey: true,
            references: '"users"',
            onDelete: 'cascade',
        },
    });

    // pgm.
};

exports.down = pgm => {};
