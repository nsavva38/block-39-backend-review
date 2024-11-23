const prisma = require("../prisma");
const bcrypt = require("bcrypt");


const seed = async () => {
  const hashed = await bcrypt.hash(`starwars`, 10);
  const user = Array.from({ length: 1 }, (_,i) => ({
    username: `Anakin Skywalker`,
    password: hashed
  }));
  await prisma.user.createMany({
    data: user
  });

  const tasks = Array.from({ length: 3}, (_,i) => ({
    name: `Task ${i + 1}`,
    ownerId: 1

  }));
  await prisma.task.createMany({
    data: tasks
  });
};

seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })