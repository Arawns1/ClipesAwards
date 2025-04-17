import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable("vote", {
    id: {
      type: "SERIAL",
      notNull: true,
      primaryKey: true,
    },
    vote_type: {
      type: "VARCHAR(4)",
      notNull: true,
      check: "vote_type IN ('UP', 'DOWN')",
    },
    created_at: {
      type: "timestamp with time zone",
      notNull: true,
      default: pgm.func("(now() at time zone 'utc')"),
    },
    id_clip: {
      type: "BIGINT",
      notNull: true,
    },
    id_user: {
      type: "BIGINT",
      notNull: true,
    },
  });

  pgm.addConstraint("vote", "vote_id_clip_fkey", {
    foreignKeys: [
      {
        columns: "id_clip",
        references: "Clip(id)",
        onDelete: "CASCADE",
      },
    ],
  });
  pgm.addConstraint("vote", "vote_id_user_fkey", {
    foreignKeys: {
      columns: "id_user",
      references: "Users(id)",
      onDelete: "CASCADE",
    },
  });

  pgm.addConstraint("vote", "unique_id_user_id_clip", {
    unique: ["id_user", "id_clip"],
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable("vote");
}
