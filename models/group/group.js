const Sequelize = require('sequelize');

module.exports = class Group extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          type: Sequelize.STRING(30),
          unique: true,
          allowNull: false,
        },
        maxMember: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        memberCount: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        groupIntro: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        states: {
          type: Sequelize.STRING(10),
          allowNull: true,
        },
        location: {
          type: Sequelize.STRING(150),
          allowNull: true,
        },
      }, // 가입일자, 탈퇴일자 추가
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'Group',
        tableName: 'groups',
        paranoid: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }

  static associate(db) {
    this.hasMany(db.ActiveTime, { foreignKey: 'groupId', sourceKey: 'id' });
    this.hasMany(db.GroupImage, { foreignKey: 'groupId', sourceKey: 'id' });
    this.hasMany(db.Skill, { foreignKey: 'groupId', sourceKey: 'id' });
    this.hasMany(db.ActiveCategory, { foreignKey: 'groupId', sourceKey: 'id' });
    this.hasMany(db.PreferGroup, {
      foreignKey: 'groupId',
      sourceKey: 'id',
    });
    this.hasMany(db.JoinGroup, { foreignKey: 'groupId', sourceKey: 'id' });
    this.hasMany(db.Qna, { foreignKey: 'groupId', sourceKey: 'id' });
  }
};
