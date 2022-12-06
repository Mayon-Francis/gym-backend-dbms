/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('users', {
        id: {
            type: 'uuid',
            primaryKey: true,
        },
        name: { 
            type: 'varchar(100)',
            notNull: true 
        },
        email: {
            type: 'varchar(100)',
            notNull: true,
            unique: true,
        },
        created_at: {
          type: 'timestamp',
          notNull: true,
          default: pgm.func('current_timestamp'),
        },
        height_in_cm: {
            type: 'float',
        },
        weight_in_kg: {
            type: 'float',
        },
        profile_image_url: {
            type: 'varchar(200)',
        },
      })
};

exports.down = pgm => {};
