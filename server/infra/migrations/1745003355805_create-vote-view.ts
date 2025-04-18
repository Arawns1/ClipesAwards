import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createView(
    "calculated_votes_view",
    {},
    `
    SELECT
        c.id AS clip_id,
        COALESCE(SUM(
            CASE 
                WHEN v.vote_type = 'UP' THEN 1
                WHEN v.vote_type = 'DOWN' THEN -1
                ELSE 0
            END
        ), 0) AS total_votes
    FROM Clip c
    LEFT JOIN Vote v ON c.id = v.clip_id
    GROUP BY c.id;
    `,
  );

  pgm.createIndex("vote", "clip_id", { name: "idx_clip_vote" });
  pgm.createIndex("vote", ["clip_id", "vote_type"], {
    name: "idx_vote_clip_type",
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropView("calculated_votes_view");
  pgm.dropIndex("vote", "clip_id", { name: "idx_clip_vote" });
  pgm.dropIndex("vote", ["clip_id", "vote_type"], {
    name: "idx_vote_clip_type",
  });
}
