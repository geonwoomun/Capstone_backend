// 아이디, 지원 날짜, 승인여부

const Sequelize = require('sequelize');

module.exports = class ApplyGroup extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        portfolio: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        activityPeriod: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        applyDate: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
        approvalCheck: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: null,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: 'ApplyGroup',
        tableName: 'ApplyGroups',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }
  static associate(db) {
    this.belongsTo(db.Member, { foreignKey: 'memberId', targetKey: 'id' });
    this.belongsTo(db.Group, {
      foreignKey: 'groupId',
      targetKey: 'id',
    });
  }
};
