const { Declaration } = require('../models/declaration');
module.exports = class DeclareController {
  static async getDeclartion(req, res) {
    const { memberId, recruitId } = req.query;
    try {
      let declartions;

      if (memberId)
        declartions = await Declaration.findAll({
          where: { targetMemberId: memberId },
        });
      if (recruitId)
        declartions = await Declaration.findAll({
          where: { targetRecruitId: recruitId },
        });

      return res.status(200).json({ declartions });
    } catch (error) {
      console.error(error);
      return next(error);
    }
  }

  static async createDeclartion(req, res) {
    const {
      title,
      contents,
      contentsType,
      targetType,
      declarorId,
      targetRecruitId,
      taregtMemberId,
    } = req.body;
    try {
      await Declaration.create({
        title,
        contents,
        contentsType,
        targetType,
        declarorId,
        targetRecruitId,
        taregtMemberId,
      });
      return res.status(200).json({ message: '신고 되었습니다.' });
    } catch (error) {
      console.error(error);
      return next(error);
    }
  }
};
