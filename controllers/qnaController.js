const { Qna, Recruit } = require('../models/recruit');
const { Member } = require('../models/member');

module.exports = class QnaController {
  static async getQnas(req, res) {
    const { recruitId } = req.params;

    try {
      const qnas = await Qna.findAll({
        where: {
          recruitId,
        },
        attributes: ['id', 'title', 'contents', 'isSecret', 'type'],
        include: [
          {
            model: Recruit,
            attributes: ['id', 'title', 'contents', 'deadLine'],
          },
          { model: Member, attributes: ['id', 'email', 'name'] },
        ],
      });
      res.status(200).json({ qnas });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 에러입니다.' });
    }
  }

  static async createQna(req, res) {
    const {
      recruitId,
      memberId,
      title,
      contents,
      isSecret,
      type,
      topQnaId,
    } = req.body;

    try {
      await Qna.create({
        memberId,
        recruitId,
        title,
        contents,
        isSecret,
        type,
        topQnaId,
      });

      res.status(200).json({ message: 'QNA가 작성되었습니다.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 에러입니다.' });
    }
  }

  static async deleteQna(req, res) {
    const { qnaId } = req.params;

    try {
      await Qna.destroy({
        where: {
          id: qnaId,
        },
      });

      res.status(200).json({ message: 'QNA가 삭제 되었습니다.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 에러입니다.' });
    }
  }
};
