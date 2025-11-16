import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/password';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean existing data
  console.log('Cleaning existing data...');
  await prisma.refreshToken.deleteMany();
  await prisma.passwordReset.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  console.log('Creating admin user...');
  const adminPassword = await hashPassword('admin123');
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
      emailVerified: true,
    },
  });
  console.log(`✓ Admin created: ${admin.email}`);

  // Create regular users
  console.log('Creating regular users...');
  const user1Password = await hashPassword('user123');
  const user1 = await prisma.user.create({
    data: {
      email: 'john@example.com',
      password: user1Password,
      name: 'John Doe',
      role: 'USER',
      emailVerified: true,
    },
  });
  console.log(`✓ User created: ${user1.email}`);

  const user2Password = await hashPassword('user123');
  const user2 = await prisma.user.create({
    data: {
      email: 'jane@example.com',
      password: user2Password,
      name: 'Jane Smith',
      role: 'USER',
      emailVerified: true,
    },
  });
  console.log(`✓ User created: ${user2.email}`);

  const user3Password = await hashPassword('user123');
  const user3 = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      password: user3Password,
      name: 'Bob Johnson',
      role: 'USER',
      emailVerified: false,
    },
  });
  console.log(`✓ User created: ${user3.email} (email not verified)`);

  // Create posts
  console.log('Creating posts...');

  const post1 = await prisma.post.create({
    data: {
      title: 'Getting Started with REST APIs',
      content: 'In this post, we will explore the fundamentals of building RESTful APIs using modern technologies...',
      published: true,
      authorId: admin.id,
    },
  });
  console.log(`✓ Post created: ${post1.title}`);

  const post2 = await prisma.post.create({
    data: {
      title: 'TypeScript Best Practices',
      content: 'TypeScript has become the de facto standard for building robust JavaScript applications. Here are some best practices...',
      published: true,
      authorId: user1.id,
    },
  });
  console.log(`✓ Post created: ${post2.title}`);

  const post3 = await prisma.post.create({
    data: {
      title: 'Understanding JWT Authentication',
      content: 'JSON Web Tokens (JWT) provide a secure way to authenticate users in modern web applications...',
      published: true,
      authorId: user2.id,
    },
  });
  console.log(`✓ Post created: ${post3.title}`);

  const post4 = await prisma.post.create({
    data: {
      title: 'Docker for Node.js Applications',
      content: 'Containerization with Docker simplifies deployment and scaling of Node.js applications...',
      published: true,
      authorId: admin.id,
    },
  });
  console.log(`✓ Post created: ${post4.title}`);

  const post5 = await prisma.post.create({
    data: {
      title: 'Draft: Advanced Prisma Techniques',
      content: 'This is a draft post about advanced Prisma ORM techniques...',
      published: false,
      authorId: user1.id,
    },
  });
  console.log(`✓ Post created: ${post5.title} (draft)`);

  const post6 = await prisma.post.create({
    data: {
      title: 'Testing Node.js Applications with Jest',
      content: 'Unit testing is crucial for maintaining code quality. Jest makes it easy and enjoyable...',
      published: true,
      authorId: user2.id,
    },
  });
  console.log(`✓ Post created: ${post6.title}`);

  console.log('\n📊 Seed Summary:');
  console.log('================');
  console.log(`Users created: 4 (1 admin, 3 regular users)`);
  console.log(`Posts created: 6 (5 published, 1 draft)`);
  console.log('\n📝 Test Credentials:');
  console.log('Admin: admin@example.com / admin123');
  console.log('User 1: john@example.com / user123');
  console.log('User 2: jane@example.com / user123');
  console.log('User 3 (unverified): bob@example.com / user123');
  console.log('\n✅ Database seeded successfully!');
}

main()
  .catch(e => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
