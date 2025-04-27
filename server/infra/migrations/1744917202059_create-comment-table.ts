import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable("comment", {
    id: {
      type: "uuid",
      default: pgm.func("gen_random_uuid()"),
      notNull: true,
      primaryKey: true,
    },
    text: {
      type: "VARCHAR(280)",
      notNull: true,
    },
    created_at: {
      type: "timestamp with time zone",
      notNull: true,
      default: pgm.func("(now() at time zone 'utc')"),
    },
    clip_id: {
      type: "BIGINT",
      notNull: true,
    },
    user_id: {
      type: "BIGINT",
      notNull: true,
    },
  });

  pgm.addConstraint("comment", "comment_id_clip_fkey", {
    foreignKeys: [
      {
        columns: "clip_id",
        references: "Clip(id)",
        onDelete: "CASCADE",
      },
    ],
  });
  pgm.addConstraint("comment", "comment_id_user_fkey", {
    foreignKeys: {
      columns: "user_id",
      references: "Users(id)",
      onDelete: "CASCADE",
    },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable("comment");
}
