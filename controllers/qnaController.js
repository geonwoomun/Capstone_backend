const { Qna } = require('../models/recruit');
const { Member } = require('../models/member');

module.exports = class QnaController {
  static async getQnas(req, res) {
    const { groupId } = req.params;

    try {
      const qnas = await Qna.findAll({
        where: {
          groupId,
          type: 'q',
        },
        attributes: ['id', 'title', 'contents', 'isSecret', 'type'],
        include: [
          {
            model: Qna,
            as: 'Reply',
            attributes: ['id', 'title', 'contents', 'isSecret', 'type'],
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
      groupId,
      memberId,
      title,
      contents,
      isSecret,
      type,
      topQnaId,
    } = req.body;

    try {
      const qna = await Qna.create({
        memberId,
        groupId,
        title,
        contents,
        isSecret,
        type,
        topQnaId,
      });

      res.status(200).json({ message: 'QNA가 작성되었습니다.', qna });
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
