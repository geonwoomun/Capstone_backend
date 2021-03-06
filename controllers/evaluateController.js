const { Evaluate, EvaluateDeclaration } = require('../models/evaluate');
const sequelize = require('../models');
const { QueryTypes } = require('sequelize');
module.exports = class EvaluationController {
  static async getEvaluate(req, res) {
    const { evaluatedGroupId, evaluateeId } = req.query;

    try {
      let evaluates;
      if (evaluatedGroupId)
        evaluates = await sequelize.query(
          `SELECT E.id,E.title, E.contents, E.score, G.id evalutedGroupId, G.name, E.createdAt createdAt FROM evaluates E INNER JOIN groups G on E.evaluatedGroupId = G.id 
                INNER JOIN members M ON E.evaluatorId = M.id where E.evaluatedGroupId = ?`,
          {
            replacements: [evaluatedGroupId],
            type: QueryTypes.SELECT,
          }
        );
      if (evaluateeId)
        evaluates = await sequelize.query(
          `SELECT E.id, E.title, E.contents, E.score, M.id evaluatorId, M.email, M.name, E.createdAt createdAt FROM evaluates E INNER JOIN members M on E.evaluateeId = M.id 
              INNER JOIN members N ON E.evaluatorId = N.id where E.evaluateeId = ?`,
          {
            replacements: [evaluateeId],
            type: QueryTypes.SELECT,
          }
        );
      res.status(200).json({ evaluates });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 에러입니다.' });
    }
  }

  static async createEvaluate(req, res) {
    const {
      evaluatorId,
      evaluatedGroupId,
      evaluateeId,
      title,
      contents,
      score,
      type,
    } = req.body;
    try {
      await Evaluate.create({
        title,
        contents,
        score,
        type,
        evaluatorId,
        evaluateeId,
        evaluatedGroupId,
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

  static async getEvaluateDeclaration(req, res) {
    const { evaluateId } = req.params;
    try {
      const declarations = await EvaluateDeclaration.findAll({
        where: {
          evaluateId,
        },
      });

      res.status(200).json({ declarations });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 에러입니다.' });
    }
  }

  static async createEvaluateDeclaration(req, res) {
    const { reason, memberId } = req.body;
    try {
      await EvaluateDeclaration.create({
        reason,
        memberId,
      });

      res.status(200).json({ message: '평가 신고가 완료 되었습니다.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 에러입니다.' });
    }
  }
};
