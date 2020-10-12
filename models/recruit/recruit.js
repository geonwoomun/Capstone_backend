// 모집글
// 아이디, 제목, 내용, 작성일시, 회원 번호, 모임번호

const Sequelize = require('sequelize');

module.exports = class Recruit extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        title: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        contents: {
          type: Sequelize.STRING(500),
          allowNull: false,
        },
        deadLine: {
          type: Sequelize.DATE,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
      }, // 가입일자, 탈퇴일자 추가
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'Recruit',
        tableName: 'recruits',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }

  static associate(db) {
    this.belongsTo(db.JoinGroup, {
      foreignKey: 'groupMemberId',
      targetKey: 'id',
    });
  }
};
