// 아이디, 직책, 회원, 모임번호

const Sequelize = require('sequelize');

module.exports = class JoinGroup extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        position: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'JoinGroup',
        tableName: 'joinGroups',
        paranoid: true,
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
    this.hasMany(db.Recruit, {
      foreignKey: 'groupMemberId',
      sourceKey: 'id',
    });
  }
};
