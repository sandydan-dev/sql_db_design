const sequelize = require("../config/db.connect");
const { DataTypes } = require("sequelize");
const Teacher = require("./Teacher.model");

const Classroom = sequelize.define("Classroom", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  TeacherId: {
    type: DataTypes.INTEGER,
  },
});

// relationships
Classroom.belongsTo(Teacher, {
  foreignKey: "TeacherId",
});

Teacher.hasMany(Classroom, {
  foreignKey: "TeacherId",
});

module.exports = Classroom;
