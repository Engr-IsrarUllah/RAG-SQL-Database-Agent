// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // 1. CLEAR DATA AND RESET ID COUNTER
  // "TRUNCATE" wipes the table and "RESTART IDENTITY" sets ID back to 1.
  // We use $executeRawUnsafe because Prisma doesn't have a native "Reset ID" command.
  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE "User" RESTART IDENTITY CASCADE;'
  );

  // 2. Create new rich data
  await prisma.user.createMany({
    data: [
      // --- ISLAMABAD USERS ---
      {
        name: "Ali Khan",
        email: "ali.k@tech.pk",
        role: "admin",
        profession: "CTO",
        city: "Islamabad",
      },
      {
        name: "Sara Ahmed",
        email: "sara.a@tech.pk",
        role: "user",
        profession: "Senior Developer",
        city: "Islamabad",
      },
      {
        name: "Bilal Saqib",
        email: "bilal.s@tech.pk",
        role: "user",
        profession: "Product Manager",
        city: "Islamabad",
      },
      {
        name: "Zara Malik",
        email: "zara.m@tech.pk",
        role: "user",
        profession: "UX Designer",
        city: "Islamabad",
      },
      {
        name: "Osman Ghani",
        email: "osman.g@tech.pk",
        role: "manager",
        profession: "Engineering Manager",
        city: "Islamabad",
      },

      // --- LAHORE USERS ---
      {
        name: "Hamza Yasin",
        email: "hamza.y@soft.pk",
        role: "user",
        profession: "Frontend Developer",
        city: "Lahore",
      },
      {
        name: "Ayesha Omer",
        email: "ayesha.o@soft.pk",
        role: "user",
        profession: "Backend Developer",
        city: "Lahore",
      },
      {
        name: "Rizwan Ahmed",
        email: "rizwan.a@soft.pk",
        role: "user",
        profession: "DevOps Engineer",
        city: "Lahore",
      },
      {
        name: "Fatima Noor",
        email: "fatima.n@soft.pk",
        role: "manager",
        profession: "HR Manager",
        city: "Lahore",
      },
      {
        name: "Hassan Ali",
        email: "hassan.a@soft.pk",
        role: "user",
        profession: "QA Engineer",
        city: "Lahore",
      },
      {
        name: "Zainab Bibi",
        email: "zainab.b@soft.pk",
        role: "user",
        profession: "Intern",
        city: "Lahore",
      },

      // --- MULTAN USERS ---
      {
        name: "Kashif Mehmood",
        email: "kashif.m@data.pk",
        role: "user",
        profession: "Data Scientist",
        city: "Multan",
      },
      {
        name: "Sadia Parveen",
        email: "sadia.p@data.pk",
        role: "user",
        profession: "Data Analyst",
        city: "Multan",
      },
      {
        name: "Umar Farooq",
        email: "umar.f@data.pk",
        role: "manager",
        profession: "Project Manager",
        city: "Multan",
      },
      {
        name: "Nida Yasir",
        email: "nida.y@data.pk",
        role: "user",
        profession: "Content Writer",
        city: "Multan",
      },

      // --- KARACHI USERS ---
      {
        name: "Fahad Mustafa",
        email: "fahad.m@media.pk",
        role: "user",
        profession: "Marketing Specialist",
        city: "Karachi",
      },
      {
        name: "Mahira Khan",
        email: "mahira.k@media.pk",
        role: "admin",
        profession: "CEO",
        city: "Karachi",
      },
      {
        name: "Ahsan Khan",
        email: "ahsan.k@media.pk",
        role: "user",
        profession: "Sales Executive",
        city: "Karachi",
      },
    ],
    skipDuplicates: true,
  });

  console.log("Seeding complete! IDs reset to 1.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
