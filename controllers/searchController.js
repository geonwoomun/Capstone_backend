const { Op } = require('sequelize');
const { Group } = require('../models/group');
const { Recruit } = require('../models/recruit');

module.exports = class SearchController {
  static async searchGroupName(req, res) {
    const { groupName } = req.params;

    try {
      const groups = await Group.findAll({
        where: {
          name: {
            [Op.like]: `${groupName}%`,
          },
        },
        attributes: ['id', 'name', 'memberCount', 'groupIntro', 'location'],
      });

      res.status(200).json({ groups });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 에러입니다.' });
    }
  }

  static async searchRecruitName(req, res) {
    const { recruitName } = req.params;

    try {
      const recruits = await Recruit.findAll({
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
