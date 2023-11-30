'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Booking.belongsTo(models.User, { foreignKey: 'patientId', targetKey: 'id', as: 'patientData' })
      Booking.belongsTo(models.Allcode, { foreignKey: 'timeType', targetKey: 'keyMap', as: 'timeTypeDataPatient' })
      Booking.belongsTo(models.Allcode, { foreignKey: 'statusId', targetKey: 'keyMap', as: 'statusTypeDataPatient' })
      Booking.belongsTo(models.Doctor_Infor, { foreignKey: 'doctorId', targetKey: 'doctorId', as: 'doctorIdTypeData' })
      Booking.belongsTo(models.Record, { foreignKey: 'recordId', targetKey: 'id', as: 'recordIdTypeData' })
    }
  };
  Booking.init({
    statusId: DataTypes.STRING,
    recordId: DataTypes.INTEGER,
    doctorId: DataTypes.INTEGER,
    patientId: DataTypes.INTEGER,
    date: DataTypes.STRING,
    timeType: DataTypes.STRING,
    token: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};