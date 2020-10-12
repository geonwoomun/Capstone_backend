const Sequelize = require('sequelize');

module.exports = class GroupImage extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        URL: {
          type: Sequelize.STRING(200),
          allowNull: false,
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
      }, // 가입일자, 탈퇴일자 추가
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'GroupImage',
        tableName: 'groupImages',
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
