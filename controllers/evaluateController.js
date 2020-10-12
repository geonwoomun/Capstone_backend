const { Evaluate } = require('../models/evaluate');
const { sequelize } = require('../models/group/group');
module.exports = class EvaluationController {
  static async getEvaluate(req, res) {
    const { groupId } = req.params;

    try {
      const evaluates = await sequelize.query(
        `SELECT * FROM evaluates E INNER JOIN groups G on E.evaluatedGroupId = G.id 
                INNER JOIN members M ON E.evaluatorId = M.id where E.evalutedGroupId = ?`,
        [groupId]
      );

      res.status(200).json({ evaluates });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 에러입니다.' });
    }
  }

  static async createEvaluate(req, res) {
    const { groupId, memberId, contents, score } = req.body;
    try {
      await Evaluate.create({
        contents,
        score,
        type: 'group',
        evaluatorId: memberId,
        evaluatedGroupId: groupId,
      });
      res.status(201).json({ message: '평가가 완료 되었습니다.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 에러입니다.' });
    }
  }

  static async removeEvaluate(req, res) {
    const { evaluateId } = req.params;
    try {
      await Evaluate.destroy({
        where: {
          id: evaluateId,
        },
      });

      res.status(200).json({ message: '평가 삭제가 완료 되었습니다.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 에러입니다.' });
    }
  }
};
