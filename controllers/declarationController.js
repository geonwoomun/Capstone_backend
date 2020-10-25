const { Declaration } = require('../models/declaration');
module.exports = class DeclareController {
  static async getDeclartion(req, res) {
    const { memberId, recruitId } = req.query;
    try {
      let declartions;

      if (memberId)
        declartions = await Declaration.findAll({
          where: { memberId },
          attributes: ['id', 'title', 'contents', 'contentsType', 'createdAt'],
        });

      if (recruitId)
        declartions = await Declaration.findAll({
          where: { recruitId },
          attributes: ['id', 'title', 'contents', 'contentsType', 'createdAt'],
        });

      res.status(200).json({ declartions });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 에러입니다.' });
    }
  }

  static async createDeclartion(req, res) {
    const {
      title,
      contents,
      contentsType,
      declarorId,
      recruitId,
      memberId,
    } = req.body;

    try {
      await Declaration.create({
        title,
        contents,
        contentsType,
        targetType: recruitId ? 'R' : 'M',
        declarorId,
        recruitId,
        memberId,
      });
      return res.status(200).json({ message: '신고 되었습니다.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 에러입니다.' });
    }
  }
};
