// 평가
// id, 내용, 구분, 점수
const Sequelize = require('sequelize');

module.exports = class Evaluate extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        contents: {
          type: Sequelize.STRING(200),
          allowNull: false,
        },
        type: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        score: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'Evaluate',
        tableName: 'evaluates',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }

  static associate(db) {
    this.belongsTo(db.Member, {
      foreignKey: 'evaluatorId',
      targetKey: 'id',
    });
    this.belongsTo(db.Member, {
      foreignKey: { field: 'evaluateeId', allowNull: true },
      targetKey: 'id',
    });
    this.belongsTo(db.Group, {
      foreignKey: { field: 'evaluatedGroupId', allowNull: true },
      targetKey: 'id',
    });
  }
};
