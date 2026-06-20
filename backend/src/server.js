import "dotenv/config";
import app from "./app.js";
import prisma from "./lib/prisma.js";

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await prisma.$connect();
    console.log("✅ Base de données connectée");
    app.listen(PORT, () => {
      console.log(`🚀 EasyBTP API en écoute sur http://localhost:${PORT}`);
      console.log(`   Health: http://localhost:${PORT}/api/health`);
    });
  } catch (e) {
    console.error("❌ Échec de connexion à la base de données:", e.message);
    console.error("   Vérifiez que PostgreSQL tourne (docker compose up -d db).");
    process.exit(1);
  }
}

start();

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
