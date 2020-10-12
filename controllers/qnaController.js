const { Qna } = require('../models/recruit');

module.exports = class QnaController {
  static async getQnas(req, res) {
    const { groupId } = req.params;

    try {
      const qnas = await Qna.findAll({
        where: {
          groupId,
        },
      });
      res.status(200).json({ qnas });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 에러입니다.' });
    }
  }

  static async createQna() {
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
      await Qna.create({
        groupId,
        memberId,
        title,
        contents,
        isSecret,
        type,
        topQnaId,
      });

      res.status(200).json({ message: 'QNA 작성 되었습니다.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 에러입니다.' });
    }
  }

  static async deleteQna() {
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
