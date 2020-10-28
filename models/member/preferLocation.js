// 활동 선호 지역
// id, 주소

const Sequelize = require('sequelize');

module.exports = class PreferLocation extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        address: {
          type: Sequelize.STRING,
          allowNull: false,
        },
      }, // 가입일자, 탈퇴일자 추가

      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: 'PreferLocation',
        tableName: 'preferLocations',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }

  static associate(db) {
    this.belongsTo(db.Member, {
      foreignKey: 'memberId',
      targetKey: 'id',
    });
  }
};
