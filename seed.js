// Using ES module imports instead of require
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.employee.createMany({
      data: [
        {
          name: "Amit Sharma",
          email: "amit.sharma@gmail.com",
          role: "Software Engineer",
          company: "TCS",
          joinDate: new Date("2022-03-15T00:00:00.000Z"),
          salary: 80000,
        },
        {
          name: "Priya Reddy",
          email: "priya.reddy@wipro.com",
          role: "Frontend Developer",
          company: "Wipro",
          joinDate: new Date("2021-07-10T00:00:00.000Z"),
          salary: 75000
        },
        {
          name: "Ravi Kumar",
          email: "ravi.kumar@infosys.com",
          role: "Backend Developer",
          company: "Infosys",
          joinDate: new Date("2020-05-22T00:00:00.000Z"),
          salary: 72000
        },
        {
          name: "Sneha Patel",
          email: "sneha.patel@accenture.com",
          role: "DevOps",
          company: "Accenture",
          joinDate: new Date("2021-09-05T00:00:00.000Z"),
          salary: 78000
        },
        {
          name: "Nikhil Joshi",
          email: "nikhil.joshi@cognizant.com",
          role: "UI/UX Designer",
          company: "Cognizant",
          joinDate: new Date("2022-01-12T00:00:00.000Z"),
          salary: 70000
        },
        {
          name: "Anjali Verma",
          email: "anjali.verma@hcl.com",
          role: "Business Analyst",
          company: "HCL",
          joinDate: new Date("2023-06-18T00:00:00.000Z"),
          salary: 65000
        },
        {
          name: "Rajesh Singh",
          email: "rajesh.singh@techmahindra.com",
          role: "Project Manager",
          company: "Tech Mahindra",
          joinDate: new Date("2019-11-25T00:00:00.000Z"),
          salary: 90000
        },
        {
          name: "Madhuri Deshmukh",
          email: "madhuri.deshmukh@tcs.com",
          role: "HR Manager",
          company: "TCS",
          joinDate: new Date("2020-02-10T00:00:00.000Z"),
          salary: 85000
        },
        {
          name: "Vikram Soni",
          email: "vikram.soni@wipro.com",
          role: "Product Manager",
          company: "Wipro",
          joinDate: new Date("2021-12-03T00:00:00.000Z"),
          salary: 95000
        },
        {
          name: "Simran Kaur",
          email: "simran.kaur@infosys.com",
          role: "Frontend Developer",
          company: "Infosys",
          joinDate: new Date("2022-08-19T00:00:00.000Z"),
          salary: 77000
        }
      ]
    });
    console.log("Data seeded successfully");
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();