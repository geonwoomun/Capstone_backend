const { Recruit, Qna } = require('../models/recruit');
const {
  Group,
  ActiveCategory,
  ActiveTime,
  GroupImage,
  Skill,
} = require('../models/group');
const { DetailCategory } = require('../models/category');
const { JoinGroup } = require('../models/groupMember');
module.exports = class RecruitController {
  static async getRecruits(req, res) {
    const { groupId } = req.params;

    try {
      const qnas = await Recruit.findAll({
        where: {
          groupId,
        },
        include: { model: Qna },
      });
      res.status(200).json({ qnas });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 에러입니다.' });
    }
  }

  static async getRecruit(req, res) {
    const { recruitId } = req.params;

    try {
      const recruit = await Recruit.findOne({
        where: {
          id: recruitId,
        },
        attributes: [
          'id',
          'title',
          'contents',
          'deadline',
          'expectMemberCount',
        ],
        include: [
          {
            model: JoinGroup,
            attributes: ['id', 'position'],
            include: [
              {
                model: Group,
                attributes: [
                  'id',
                  'name',
                  'memberCount',
                  'groupIntro',
                  'location',
                ],
                include: [
                  {
                    model: ActiveCategory,
                    attributes: ['id'],
                    include: [
                      { model: DetailCategory, attributes: ['id', 'name'] },
                    ],
                  },
                  { model: Skill, attributes: ['id', 'name'] },
                  {
                    model: GroupImage,
                    attributes: ['id', 'URL', 'description'],
                  },
                  {
                    model: ActiveTime,
                    attributes: ['id', 'activeDay', 'startTime', 'endTime'],
                  },
                ],
              },
            ],
          },
        ],
      });

      res.status(200).json({ recruit });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 에러 입니다.' });
    }
  }

  static async createRecruit(req, res) {
    const { title, contents, deadline, expectMemberCount } = req.body;

    const [years, hours] = deadline.split(' ');
    const [year, month, day] = years.split('-');
    const [hour, minutes, second] = hours.split(':');
    try {
      await Recruit.create({
        title,
        contents,
        expectMemberCount,
        deadLine: new Date(
          year,
          month - 1,
          day,
          hour,
          minutes,
          second
        ).toLocaleString('ko-KR', {
          dateStyle: 'short',
          timeStyle: 'medium',
          hour12: false,
        }),
      });

      res.status(200).json({ message: '모집글이 작성되었습니다.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 에러입니다' });
    }
  }

  static async updateRecruit(req, res) {
    const { recruitId, title, contents, expectMemberCount } = req.body;

    try {
      await Recruit.update(
        { title, contents, expectMemberCount },
        {
          where: {
            id: recruitId,
          },
        }
      );

      res.status(200).json({ message: '모집글 수정이 완료 되었습니다.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 에러입니다' });
    }
  }

  static async deleteRecruit(req, res) {
    const { recruitId } = req.params;

    try {
      await Recruit.destroy({ where: { id: recruitId } });

      res.status(200).json({ message: '모집글 삭제가 완료되었습니다.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 에러입니다' });
    }
  }
};
