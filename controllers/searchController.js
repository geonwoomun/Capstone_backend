const { Op } = require('sequelize/types');
const { Group } = require('../models/group');

module.exports = class SearchController {
  static async searchByName(req, res) {
    const { groupName } = req.params;

    try {
      const groups = await Group.findAll({
        where: {
          name: {
            [Op.like]: `${groupName}%`,
          },
        },
      });

      res.status(200).json({ groups });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 에러입니다.' });
    }
  }
};
