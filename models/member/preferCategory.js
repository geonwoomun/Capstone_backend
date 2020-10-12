// 선호 카테고리
// id, 회원id, 세부카테고리id

const Sequelize = require('sequelize');

module.exports = class PreferCategory extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {}, // 가입일자, 탈퇴일자 추가
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: 'PreferCategory',
        tableName: 'preferCategorys',
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

    this.belongsTo(db.DetailCategory, {
      foreignKey: 'detailCategoryId',
      targetKey: 'id',
    });
  }
};
