import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable("vote", {
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
    clip_id: {
      type: "BIGINT",
      notNull: true,
    },
    user_id: {
      type: "BIGINT",
      notNull: true,
    },
  });

  // Define a chave primária composta
  pgm.addConstraint("vote", "vote_pkey", {
    primaryKey: ["clip_id", "user_id"],
  });

  pgm.addConstraint("vote", "vote_id_clip_fkey", {
    foreignKeys: [
      {
        columns: "clip_id",
        references: "Clip(id)",
        onDelete: "CASCADE",
      },
    ],
  });
  pgm.addConstraint("vote", "vote_id_user_fkey", {
    foreignKeys: {
      columns: "user_id",
      references: "Users(id)",
      onDelete: "CASCADE",
    },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable("vote");
}
