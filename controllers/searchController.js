const { Op } = require('sequelize');
const sequelize = require('../models');
const {
  ActiveTime,
  Group,
  GroupImage,
  Skill,
  ActiveCategory,
} = require('../models/group');
const { PreferGroup } = require('../models/groupMember');
const { Recruit } = require('../models/recruit');
const { Category, DetailCategory } = require('../models/category');

module.exports = class SearchController {
  static async searchGroupByFilter(req, res) {
    const {
      category,
      groupName,
      sortBase,
      peopleNumber,
      activeDay = [],
      activeLocation = [],
    } = req.body;

    const detailIds = await DetailCategory.findAll({
      attributes: ['id'],
      include: [
        {
          model: Category,
          where: {
            type: category,
          },
          required: true,
        },
      ],
    });

    const nameCondition = groupName
      ? {
          name: {
            [Op.like]: `${groupName}%`,
          },
        }
      : {};

    const number = Number(peopleNumber);
    const numberCondition =
      number === 0
        ? {}
        : number < 10
        ? { maxMember: { [Op.lte]: number } }
        : {
            maxMember: {
              [Op.gte]: number,
            },
          };

    const activeDayCondition = !activeDay.length
      ? {}
      : {
          where: {
            activeDay: {
              [Op.in]: activeDay,
            },
          },
          required: true,
        };

    const activeLocationCondition =
      !activeLocation.length || activeLocation.includes('전국')
        ? {}
        : {
            states: {
              [Op.in]: activeLocation,
            },
          };

    const sortBaseCondition =
      sortBase === 'like'
        ? [sequelize.literal('likeNumber'), 'DESC']
        : sortBase === 'lastest'
        ? ['createdAt', 'ASC']
        : ['id', 'DESC'];

    try {
      const groups = await Group.findAll({
        where: {
          ...nameCondition,
          ...numberCondition,
          ...activeLocationCondition,
        },
        attributes: {
          include: [
            [
              sequelize.fn('COUNT', sequelize.col('prefergroups.groupId')),
              'likeNumber',
            ],
          ],
          exclude: ['createdAt', 'updatedAt', 'deletedAt'],
        },
        include: [
          {
            model: ActiveTime,
            attributes: ['id', 'activeDay', 'startTime', 'endTime'],
            ...activeDayCondition,
          },
          {
            model: PreferGroup,
          },
          { model: Skill, attributes: ['id', 'name'] },
          { model: GroupImage, attributes: ['id', 'URL', 'description'] },
          {
            model: ActiveCategory,
            include: [
              {
                model: DetailCategory,
                where: {
                  id: {
                    [Op.in]: detailIds.map((v) => v.id),
                  },
                },
                required: true,
                attributes: ['id', 'name'],
                include: { model: Category, attributes: ['id', 'type'] },
              },
            ],
            required: true,
          },
        ],
        group: ['id'],
        order: [sortBaseCondition],
      });

      console.log(groups);
      res.status(200).json({ groups });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 에러입니다.' });
    }
  }

  static async searchGroupsByFilter(req, res) {
    const { sortBase, peopleNumber, activeDay, activeLocation } = req.body;

    try {
      const recruits = await Group.findAll({
        where: {
          [Op.or]: [
            {
              title: {
                [Op.like]: `%${recruitName}%`,
              },
            },
            {
              contents: {
                [Op.like]: `%${recruitName}%`,
              },
            },
          ],
        },
        attributes: ['id', 'title', 'contents', 'deadline'],
      });

      res.status(200).json({ recruits });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 에러입니다.' });
    }
  }
};
