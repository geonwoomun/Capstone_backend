const Sequelize = require('sequelize');

module.exports = class Member extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        email: {
          type: Sequelize.STRING(40),
          allowNull: false,
          unique: true,
        },
        password: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        name: {
          type: Sequelize.STRING(15),
          allowNull: false,
        },
        isProved: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        profileImg: {
          type: Sequelize.STRING(150),
          allowNull: true,
        },
        gender: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
        telephone: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        type: {
          // 이메일, 카카오, 구글
          type: Sequelize.STRING(10),
          allowNull: false,
          defaultValue: 'local',
        },
        declareCount: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        snsId: {
          type: Sequelize.STRING(30),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'Member',
        tableName: 'members',
        paranoid: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }

  static associate(db) {
    this.hasMany(db.PreferCategory, {
      foreignKey: 'memberId',
      sourceKey: 'id',
    });
    this.hasMany(db.PreferLocation, {
      foreignKey: 'memberId',
      sourceKey: 'id',
    });
    this.hasMany(db.Qna, {
      foreignKey: 'memberId',
      sourceKey: 'id',
    });
    this.hasMany(db.PreferGroup, {
      foreignKey: 'memberId',
      sourceKey: 'id',
    });
    this.hasMany(db.JoinGroup, {
      foreignKey: 'memberId',
      sourceKey: 'id',
    });
    this.hasMany(db.ApplyGroup, {
      foreignKey: 'memberId',
      sourceKey: 'id',
    });
  }
};
