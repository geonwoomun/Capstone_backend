//아이디, 알림 수신 여부
// 그룹, 회원 번호

const Sequelize = require('sequelize');

module.exports = class PreferGroup extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        type: {
          //선호
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
      }, // 가입일자, 탈퇴일자 추가
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: 'PreferGroup',
        tableName: 'preferGroups',
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
    this.belongsTo(db.Group, {
      foreignKey: 'groupId',
      targetKey: 'id',
    });
  }
};
