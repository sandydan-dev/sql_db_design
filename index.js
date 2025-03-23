const express = require("express");
const app = express();
const PORT = 3000;

const sequelize  = require("./config/db.connect");

const Teacher = require("./model/Teacher.model");
const Student = require("./model/Student.model");
const Classroom = require("./model/Classroom.model");

app.use(express.json());

// data

const teachers = [
  { name: "Mrs. Sharma", email: "sharma@example.com" },
  { name: "Mr. Verma", email: "verma@example.com" },
];

let classrooms = [
  { name: "Physics", TeacherId: 1 },
  { name: "Mathematics", TeacherId: 2 },
];

let studentData = [
  {
    name: "Anjali Gupta",
    email: "anjali@example.com",
    age: 19,
    ClassroomId: 1,
  },
  {
    name: "Neha Bansal",
    email: "neha@example.com",
    age: 20,
    ClassroomId: 2,
  },
  {
    name: "Rahul Mehta",
    email: "rahul@example.com",
    age: 21,
    ClassroomId: 1,
  },
  {
    name: "Ravi Kumar",
    email: "ravi@example.com",
    age: 22,
    ClassroomId: 2,
  },
];

// routes

app.get("/seed_db", async (req, res) => {
  try {
    // Sync database
    await sequelize.sync({ force: true });

    // Seed Teachers
    await Teacher.bulkCreate(teachers, { returning: true });

    // Seed Classrooms
    await Classroom.bulkCreate(classrooms);

    // Seed Students with ClassroomId
    await Student.bulkCreate(studentData);

    res.status(200).json({
      message: "Database seeded with Teacher, Classroom, and Student data!",
    });
  } catch (error) {
    console.error("Error during database seeding:", error); // Log the error
    res
      .status(500)
      .json({ message: "Error Seeding the Data", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
