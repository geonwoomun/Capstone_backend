const Sequelize = require('sequelize');
const { Member, PreferCategory, PreferLocation } = require('./member');
// const PreferCategory = require('./member/preferCategory');
// const PreferLocation = require('./member/preferLocation');
const {
  Group,
  ActiveTime,
  GroupImage,
  Skill,
  ActiveCategory,
} = require('./group');
const { Evaluate, EvaluateDeclaration } = require('./evaluate');
const { ApplyGroup, JoinGroup, PreferGroup } = require('./groupMember');
const { Qna, Recruit } = require('./recruit');
const { Category, DetailCategory } = require('./category');
const { Declaration } = require('./declaration');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const db = {
  Member,
  Group,
  PreferCategory,
  PreferLocation,
  ActiveTime,
  GroupImage,
  Skill,
  Evaluate,
  EvaluateDeclaration,
  ApplyGroup,
  JoinGroup,
  PreferGroup,
  PreferCategory,
  Qna,
  Recruit,
  Category,
  DetailCategory,
  Declaration,
  ActiveCategory,
};

const Models = Object.keys(db);

Models.forEach((model) => {
  if (db[model].init) db[model].init(sequelize);
});

Models.forEach((model) => {
  if (db[model].associate) db[model].associate(db);
});

module.exports = sequelize;
