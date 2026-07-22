import { app } from "./app.js";
import { prisma } from "./db.js";
const port = Number(process.env.API_PORT ?? 3000);
const server = app.listen(port, () =>
  console.log(`API local em http://localhost:${port}`),
);
process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  server.close();
});
