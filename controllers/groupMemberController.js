const JoinGroup = require('../models/groupMember/joinGroup');
const ApplyGroup = require('../models/groupMember/applyGroup');
const PreferGroup = require('../models/groupMember/preferGroup');
const { Group } = require('../models/group');

module.exports = class GroupMemberController {
  static async getJoinGroup(req, res) {
    const { userId } = req.params;
    try {
      const groups = await JoinGroup.findAll({ where: { userId } });

      res.status(200).json({ groups });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 에러입니다.' });
    }
  }

  static async createJoinGroup(req, res) {
    const { userId, groupId } = req.body;

    try {
      await JoinGroup.create({
        userId,
        groupId,
      });

      // 가입 되면서 지원서 승인 여부 ok로 바꿔줌.
      res.status(200).json({ message: '그룹에 가입 되었습니다.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 에러입니다.' });
    }
  }

  static async deleteJoinGroup(req, res) {
    const { memberId, groupId } = req.query;
    try {
      await JoinGroup.destroy({
        where: {
          memberId,
          groupId,
        },
      });

      res.status(200).json({ message: '탈퇴처리 되었습니다.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 에러입니다.' });
    }
  }

  static async getApplyGroup(req, res) {
    const { userId } = req.params;

    try {
      const groups = await ApplyGroup.findAll({ where: { userId } });

      res.status(200).json({ groups });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: ' 서버 에러입니다.' });
    }
  }

  static async createApplyGroup(req, res) {
    const { userId, groupId } = req.body;

    try {
      await ApplyGroup.create({
        userId,
        groupId,
      });

      res.status(200).json({ message: '그룹에 가입 신청 되었습니다.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 에러입니다.' });
    }
  }
  static async getPreferGroup(req, res) {
    const { userId } = req.params;

    // 선호모임 -> 그룹 id, 그룹id와 가입모임, type이 직책이 스터디장인 사람이
    // 작성한 모집글이 있으면, 모집 중, 아니면 모집 중이 아님.

    try {
      const groups = await sequelize.query(
        `SELECT a.groupId groupId, b.id recruit FROM (SELECT a FROM joinGroups where groupId = (SELECT groupId FROM WHERE preferGroups userId = ?) and position ="leader") A LEFT JOIN recruits B on A.id = B.groupMemberId `,
        [userId]
      );
      const recruitingGroupIds = [];
      const recruitedGroupIds = [];
      Array.from(groups).forEach((group) =>
        group.recruit
          ? recruitingGroupIds.push(group.groupId)
          : recruitedGroupIds.push(group.groupId)
      );

      const [recruitingGroups, recruitedGroups] = await Promise.all([
        Group.findAll({
          where: {
            id: recruitingGroupIds,
          },
        }),
        Group.findAll({
          where: {
            id: recruitedGroupIds,
          },
        }),
      ]);

      res.status(200).json({ recruitingGroups, recruitedGroups });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버에러 입니다.' });
    }
  }

  static async createPreferGroup(req, res) {
    const { userId, groupId } = req.body;

    try {
      await PreferGroup.create({
        userId,
        groupId,
      });

      res.status(200).json({ message: '선호 그룹으로 등록되었습니다.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 에러입니다.' });
    }
  }

  static async updatePreferGroup(req, res) {
    const { memberId, groupId, type } = req.body;
    try {
      await PreferGroup.update(
        { type },
        {
          where: {
            memberId,
            groupId,
          },
        }
      );

      res.status(200).json({ message: '푸시알림이 재설정 되었습니다.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 에러입니다.' });
    }
  }

  static async deletePreferGroup(req, res) {
    const { userId, groupId } = req.body;
    try {
      await PreferGroup.destroy({
        userId,
        groupId,
      });

      res.status(200).json({ message: '선호 그룹이 삭제 되었습니다.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 에러입니다.' });
    }
  }

  static async updateMemberInfo(req, res) {
    const { groupId, memberId, leaderId, position } = req.body;

    try {
      const isLeader = await JoinGroup.findOne({
        where: { memberId: leaderId, position: 'leader' },
      });

      if (!isLeader)
        return res.status(400).json({ message: '모임장이 아닙니다.' });

      await JoinGroup.update(
        {
          position,
        },
        {
          where: {
            groupId,
            memberId,
          },
        }
      );

      res.status(200).json({ message: '팀원 정보가 수정되었습니다.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 에러입니다.' });
    }
  }
};
