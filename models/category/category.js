// 카테고리
// 아이디, 카테고리 구분
const Sequelize = require('sequelize');

module.exports = class Category extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        type: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
      }, // 가입일자, 탈퇴일자 추가
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'Category',
        tableName: 'categorys',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }

  static associate(db) {
    this.hasMany(db.DetailCategory, {
      foreignKey: 'categoryId',
      sourceKey: 'id',
    });
  }
};
