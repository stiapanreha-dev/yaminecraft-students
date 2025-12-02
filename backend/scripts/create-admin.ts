import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2] || 'admin@local';
  const password = process.argv[3] || 'admin123456';
  const firstName = process.argv[4] || 'Admin';
  const lastName = process.argv[5] || 'User';

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log(`User with email ${email} already exists`);

    if (existingUser.role !== Role.ADMIN) {
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { role: Role.ADMIN },
      });
      console.log(`Updated ${email} to ADMIN role`);
    }

    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: Role.ADMIN,
    },
  });

  await prisma.rating.create({
    data: {
      userId: user.id,
    },
  });

  console.log(`Admin user created successfully!`);
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
