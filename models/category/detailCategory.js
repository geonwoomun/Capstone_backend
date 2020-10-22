// 세부 카테고리
// id, 카테고리명,  카테고리번호

const Sequelize = require('sequelize');

module.exports = class DetailCategory extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'DetailCategory',
        tableName: 'detailCategorys',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }

  static associate(db) {
    this.belongsTo(db.Category, {
      foreignKey: 'categoryId',
      targetKey: 'id',
    });

    this.hasMany(db.PreferCategory, {
      foreignKey: 'detailCategoryId',
      sourceKey: 'id',
    });

    this.hasMany(db.ActiveCategory, {
      foreignKey: 'detailCategoryId',
      sourceKey: 'id',
    });
  }
};
