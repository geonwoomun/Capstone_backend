const Sequelize = require('sequelize');

module.exports = class ActiveTime extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        activeDay: {
          type: Sequelize.STRING(10),
          allowNull: false,
        },
        startTime: {
          type: Sequelize.STRING(30),
          allowNull: false,
        },
        endTime: {
          type: Sequelize.STRING(30),
          allowNull: false,
        },
      }, // 가입일자, 탈퇴일자 추가
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'ActiveTime',
        tableName: 'activeTimes',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }

  static associate(db) {
    this.belongsTo(db.Group, {
      foreignKey: 'groupId',
      targetKey: 'id',
    });
  }
};
