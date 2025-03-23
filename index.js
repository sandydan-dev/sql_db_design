const express = require("express");
const app = express();
const PORT = 3000;

const sequelize = require("./config/db.connect");

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

// teacher routes
// Get all teachers
app.get("/teachers", async (req, res) => {
  try {
    const teachers = await Teacher.findAll();
    res.status(200).json(teachers);
  } catch (error) {
    console.error("Error fetching teachers:", error);
    res
      .status(500)
      .json({ message: "Error fetching teachers", error: error.message });
  }
});

// add new teacher data

app.post("/teachers", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    // Temporarily disable foreign key constraints
    await sequelize.query("PRAGMA foreign_keys = OFF;");

    const teacher = await Teacher.findByPk(id);

    if (!teacher) {
      // Re-enable foreign key constraints
      await sequelize.query("PRAGMA foreign_keys = ON;");
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Delete the teacher
    await teacher.destroy();

    // Re-enable foreign key constraints
    await sequelize.query("PRAGMA foreign_keys = ON;");

    res.status(200).json({ message: "Teacher deleted" });
  } catch (error) {
    console.error("Error creating teacher:", error);
    res
      .status(500)
      .json({ message: "Error creating teacher", error: error.message });
  }
});

// update teacher data by id

app.put("/teachers/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updatedTeacher = req.body;

    const teacher = await Teacher.findByPk(id);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    await teacher.update(updatedTeacher);
    res.status(200).json({ message: "Teacher updated", data: teacher });
  } catch (error) {
    console.error("Error updating teacher:", error);
    res
      .status(500)
      .json({ message: "Error updating teacher", error: error.message });
  }
});

// delete teacher data by id
app.delete("/teachers/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    // Disable foreign key checks
    await sequelize.query("PRAGMA foreign_keys = OFF;");

    const teacher = await Teacher.findByPk(id);
    if (!teacher) {
      await sequelize.query("PRAGMA foreign_keys = ON;");
      return res.status(404).json({ message: "Teacher not found" });
    }

    await teacher.destroy();

    // Re-enable foreign key checks
    await sequelize.query("PRAGMA foreign_keys = ON;");

    res.status(200).json({ message: "Teacher deleted" });
  } catch (error) {
    console.error("Error deleting teacher:", error);
    await sequelize.query("PRAGMA foreign_keys = ON;");
    res
      .status(500)
      .json({ message: "Error deleting teacher", error: error.message });
  }
});

// classrom routes

app.get("/classrooms", async (req, res) => {
  try {
    const classrom = await Classroom.findAll();
    res.status(200).json(classrom);
  } catch (error) {
    console.error("Error fetching classrom:", error);
    res
      .status(500)
      .json({ message: "Error fetching classrom", error: error.message });
  }
});

app.post("/classrooms", async (req, res) => {
  try {
    const classroom = req.body;
    const newClassroom = await Classroom.create(classroom);
    res.status(201).json(newClassroom);
  } catch (error) {
    console.error("Error creating classroom:", error);
    res
      .status(500)
      .json({ message: "Error creating classroom", error: error.message });
  }
});

// update classroom

app.put("/classrooms/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updatedClassroom = req.body;
    const classroom = await Classroom.findByPk(id);
    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }
    await classroom.update(updatedClassroom);
    res.status(200).json({ message: "Classroom updated", data: classroom });
  } catch (error) {
    console.error("Error updating classroom:", error);
    res
      .status(500)
      .json({ message: "Error updating classroom", error: error.message });
  }
});

// delete classroom

app.delete("/classrooms/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await sequelize.query("PRAGMA foreign_keys = OFF;");

    const classroom = await Classroom.findByPk(id);
    if (!classroom) {
      await sequelize.query("PRAGMA foreign_keys = ON;");
      return res.status(404).json({ message: "Classroom not found" });
    }
    await classroom.destroy();
    res.status(200).json({ message: "Classroom deleted" });
  } catch (error) {
    console.error("Error deleting classroom:", error);
    await sequelize.query("PRAGMA foreign_keys = ON;");
    res
      .status(500)
      .json({ message: "Error deleting classroom", error: error.message });
  }
});

// student routes

app.get("/students", async (req, res) => {
  try {
    const students = await Student.findAll();
    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res
      .status(500)
      .json({ message: "Error fetching students", error: error.message });
  }
});

// add new student data

app.post("/students", async (req, res) => {
  try {
    const student = req.body;
    const newStudent = await Student.create(student);
    res.status(201).json(newStudent);
  } catch (error) {
    console.error("Error creating student:", error);
    res
      .status(500)
      .json({ message: "Error creating student", error: error.message });
  }
});

app.put("/students/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updatedStudent = req.body;
    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    await student.update(updatedStudent);
    res.status(200).json({ message: "Student updated", data: student });
  } catch (error) {
    console.error("Error updating student:", error);
    res
      .status(500)
      .json({ message: "Error updating student", error: error.message });
  }
});

app.delete("/students/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await sequelize.query("PRAGMA foreign_keys = OFF;");
    const student = await Student.findByPk(id);
    if (!student) {
      await sequelize.query("PRAGMA foreign_keys = ON;");
      return res.status(404).json({ message: "Student not found" });
    }
    await student.destroy();
    res.status(200).json({ message: "Student deleted" });
  } catch (error) {
    console.error("Error deleting student:", error);
    await sequelize.query("PRAGMA foreign_keys = ON;");
    res
      .status(500)
      .json({ message: "Error deleting student", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
