const Sequelize = require('sequelize');

module.exports = class Group extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {}, // 가입일자, 탈퇴일자 추가
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: 'ActiveCategory',
        tableName: 'activeCategorys',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }

  static associate(db) {
    this.belongsTo(db.DetailCategory, {
      foreignKey: 'detailCategoryId',
      targetKey: 'id',
    });
    this.belongsTo(db.Group, { foreignKey: 'groupId', targetKey: 'id' });
  }
};
