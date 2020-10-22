const Sequelize = require('sequelize');

module.exports = class Declaration extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        title: {
          type: Sequelize.STRING(200),
          allowNull: false,
        },
        contents: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        contentsType: {
          // 욕설/비하, 상업적 광고, 게시판 성격 부적절, 음란ㅁ눌
          type: Sequelize.STRING,
          allowNull: false,
        },
        targetType: {
          // 회원, 모집글
          type: Sequelize.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'Declaration',
        tableName: 'declarations',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }

  static associate(db) {
    this.belongsTo(db.Member, {
      foreignKey: { field: 'declarorId', allowNull: false },
      targetKey: 'id',
    });
    this.belongsTo(db.Member, {
      foreignKey: { field: 'targetMemberId', allowNull: true },
      targetKey: 'id',
    });
    this.belongsTo(db.Recruit, {
      foreignKey: { field: 'targetRecruitId', allowNull: true },
      targetKey: 'id',
    });
  }
};
