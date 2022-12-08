/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('trainer_assigned', {
        id: {
            type: 'uuid',
            primaryKey: true,
        },
        user_id: {
            type: 'uuid',
            notNull: true,
            references: '"users"',
            onDelete: 'cascade',
        },
        trainer_id: {
            type: 'uuid',
            notNull: true,
            references: '"trainers"',
            onDelete: 'cascade',
        },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        status: {
            type: 'varchar(100)',
            notNull: true,
        }
    });
};

exports.down = pgm => {};
