//qna
// qna 번호, 제목, 내용, 비밀여부, 작성일시, qna 구분
// 상위 qna 번호, 회원번호, 모집글 번호

const Sequelize = require('sequelize');

module.exports = class Qna extends Sequelize.Model {
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
        isSecret: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        type: {
          type: Sequelize.STRING,
          allowNull: false,
        },
      }, // 가입일자, 탈퇴일자 추가
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'Qna',
        tableName: 'qnas',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }

  static associate(db) {
    this.belongsTo(db.Group, { foreignKey: 'groupId', targetKey: 'id' });
    this.belongsTo(db.Member, { foreignKey: 'memberId', targetKey: 'id' });
    this.hasMany(db.Qna, { foreignKey: 'topQnaId', sourceKey: 'id' });
  }
};
