import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable("users", {
    // BIGINT pois SERIAL possui ate 32 bits e o SNOWFLAKE(discord) vai até 64 bits
    id: {
      type: "BIGINT",
      notNull: true,
      primaryKey: true,
    },
    avatar_url: {
      type: "TEXT",
    },
    // 32 pois é o máximo que o discord permite
    username: {
      type: "VARCHAR(32)",
      notNull: true,
      unique: true,
    },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable("users");
}
