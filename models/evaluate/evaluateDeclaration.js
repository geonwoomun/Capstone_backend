// 평가 신고
// id, 평가번호, 이유

const Sequelize = require('sequelize');

module.exports = class EvaluateDeclaration extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        reason: {
          type: Sequelize.STRING(200),
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'EvaluateDeclaration',
        tableName: 'evaluateDeclarations',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }

  static associate(db) {
    this.belongsTo(db.Evaluate, {
      foreignKey: 'detailCategoryId',
      targetKey: 'id',
    });
  }
};
