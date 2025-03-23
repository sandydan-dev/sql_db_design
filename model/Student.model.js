const sequelize = require("../config/db.connect");
const { DataTypes } = require("sequelize");
const Classroom = require("./Classroom.model");

const Student = sequelize.define("Student", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    required: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    required: true,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
    required: true,
  },
  ClassroomId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    required: true,
  },
});

// relationships

Student.belongsTo(Classroom, {
  foreignKey: "ClassroomId",
});

Classroom.hasMany(Student, {
  foreignKey: "ClassroomId",
});

module.exports = Student;
