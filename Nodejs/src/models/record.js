'use strict';
const {
  Model
} = require('sequelize');
const { sequelize } = require('.');
module.exports = (sequelize, DataTypes) => {
  class Record extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Record.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', as: 'userData' })
      Record.belongsTo(models.Allcode, { foreignKey: 'gender', targetKey: 'keyMap', as: 'genderDataRecord' })
      Record.hasMany(models.Booking, { foreignKey: 'recordId', as: 'recordIdTypeData' })
    }
  };
  Record.init({
    userId: DataTypes.INTEGER,
    fullName: DataTypes.STRING,
    address: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    gender: DataTypes.STRING,
    roleId: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Record',
  });
  return Record;
};