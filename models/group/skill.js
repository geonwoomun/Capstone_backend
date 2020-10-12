const Sequelize = require('sequelize');

module.exports = class Skill extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          type: Sequelize.STRING(30),
          allowNull: false,
        },
      }, // 가입일자, 탈퇴일자 추가
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'Skill',
        tableName: 'skills',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }

  static associate(db) {
    this.belongsTo(db.Group, {
      foreignKey: 'groupId',
      targetKey: 'id',
    });
  }
};
