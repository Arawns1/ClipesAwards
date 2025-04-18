import database from "infra/database";

async function seedDatabase() {
  console.log("> Seeding database...");

  await Promise.all([
    database.query({
      text: `INSERT INTO Clip (id) VALUES(1362569884076216581);`,
    }),
    database.query({
      text: `INSERT INTO Users
      (id, avatar_url, username)
      VALUES(198930202967932928, 'https://cdn.discordapp.com/attachments/1145570523330379917/1362569884076216581/Call_of_Duty_Modern_Warfare_2019_2021.06.15_-_22.02.12.02.DVR_Trim_Trim_2.mp4?ex=6802df97&is=68018e17&hm=4f4fe7dfcd4e8c442dda13bb2f0edc148f0a229382f7db4ac441c342aa78656b&', 'Arawns');`,
    }),
  ]);

  console.log("\n> Database seeded!");
  process.exit();
}

seedDatabase();
