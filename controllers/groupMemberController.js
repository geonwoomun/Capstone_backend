const JoinGroup = require('../models/groupMember/joinGroup');
const ApplyGroup = require('../models/groupMember/applyGroup');
const PreferGroup = require('../models/groupMember/preferGroup');
const { Group, ActiveCategory, GroupImage } = require('../models/group');
const { DetailCategory } = require('../models/category');
const { Member } = require('../models/member');
const { QueryTypes } = require('sequelize');
const sequelize = require('../models');
const group = require('../models/group');

module.exports = class GroupMemberController {
  static async getJoinGroup(req, res) {
    const { memberId } = req.params;
    try {
      const groups = await JoinGroup.findAll({
        where: { memberId },
        attributes: ['id', 'position', 'createdAt'],
        include: [
          {
            model: Group,
            attributes: ['id', 'name', 'memberCount', 'groupIntro', 'location'],
            include: {
              model: GroupImage,
              attributes: ['id', 'URL', 'description'],
            },
          },
        ],
      });

      res.status(200).json({ groups });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 에러입니다.' });
    }
  }

  static async createJoinGroup(req, res) {
    const { applyId, memberId } = req.body;

    try {
      const applyInfo = await ApplyGroup.findOne({
        where: {
          id: applyId,
          approvalCheck: null,
        },
      });

      if (!applyInfo) {
        return res.status(400).json({ message: '지원서가 없습니다.' });
      }

      const isLeader = await JoinGroup.findOne({
        where: {
          memberId,
          groupId: applyInfo.groupId,
        },
      });

      if (!isLeader)
        return res.status(400).json({ message: '그룹장이 아닙니다.' });

      await Promise.all([
        await ApplyGroup.update(
          {
            approvalCheck: true,
          },
          {
            where: {
              id: applyId,
            },
          }
        ),
        await JoinGroup.create({
          memberId: applyInfo.memberId,
          groupId: applyInfo.groupId,
          position: 'N',
        }),
      ]);

      // 가입 되면서 지원서 승인 여부 ok로 바꿔줌.
      res.status(200).json({ message: '그룹에 가입 되었습니다.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 에러입니다.' });
    }
  }

  static async deleteJoinGroup(req, res) {
    const { groupId, leaderId, memberId } = req.query;

    try {
      const isLeader = await JoinGroup.findOne({
        where: {
          memberId: leaderId,
          position: 'L',
        },
      });
      if (leaderId && !isLeader)
        return res.status(400).json({ message: '그룹장이 아닙니다.' });

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
    const { memberId } = req.params;

    try {
      const groups = await ApplyGroup.findAll({
        where: { memberId },
        include: [
          {
            model: Group,
            attributes: ['id', 'name', 'memberCount', 'groupIntro'],
          },
        ],
      });

      res.status(200).json({ groups });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: ' 서버 에러입니다.' });
    }
  }
  static async getApplyMember(req, res) {
    const { groupId } = req.params;

    try {
      const members = await ApplyGroup.findAll({
        where: { groupId },
        include: [
          {
            model: Member,
            attributes: ['id', 'email', 'name'],
          },
        ],
      });

      res.status(200).json({ members });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: ' 서버 에러입니다.' });
    }
  }

  static async getApply(req, res) {
    const { applyId } = req.params;
    try {
      const apply = await ApplyGroup.findOne({
        where: {
          id: applyId,
        },
        include: [
          {
            model: Member,
            attributes: {
              exclude: ['password', 'createdAt', 'updatedAt', 'deltedAt'],
            },
          },
          {
            model: Group,
            include: [
              {
                model: GroupImage,
                attributes: {
                  exclude: ['createdAt', 'updatedAt'],
                },
              },
            ],
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'deletedAt'],
            },
          },
        ],
      });

      res.status(200).json({ apply });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: ' 서버 에러입니다.' });
    }
  }

  static async createApplyGroup(req, res) {
    const { memberId, groupId, portfolio, activityPeriod } = req.body;

    try {
      const isApply = await ApplyGroup.findOne({
        where: {
          memberId,
          groupId,
          approvalCheck: null,
        },
      });
      if (isApply) {
        return res.status(400).json({ message: '이미 지원한 모임입니다.' });
      }

      await ApplyGroup.create({
        memberId,
        groupId,
        portfolio,
        activityPeriod,
      });

      res.status(200).json({ message: '그룹에 가입 신청 되었습니다.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 에러입니다.' });
    }
  }

  static async rejectApplyMember(req, res) {
    const { applyId, groupId, memberId } = req.body;

    try {
      const isLeader = await JoinGroup.findOne({
        where: {
          memberId,
          groupId,
          position: 'L',
        },
      });

      if (!isLeader) {
        return res.status(400).json({ message: '그룹장이 아닙니다.' });
      }

      await ApplyGroup.update(
        {
          approvalCheck: false,
        },
        {
          where: {
            id: applyId,
          },
        }
      );

      res.status(200).json({ message: '가입 신청이 거절 되었습니다.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 에러입니다.' });
    }
  }

  static async getPreferGroup(req, res) {
    const { memberId } = req.params;

    // 선호모임 -> 그룹 id, 그룹id와 가입모임, type이 직책이 스터디장인 사람이
    // 작성한 모집글이 있으면, 모집 중, 아니면 모집 중이 아님.

    try {
      const [recruitedGroupIds, recruitingGroupIds] = await Promise.all([
        sequelize.query(
          `SELECT A.groupId groupId, B.deadLine deadLine FROM (SELECT * FROM joinGroups where groupId IN (SELECT groupId FROM preferGroups where memberId = ?) and position = "L") A LEFT JOIN recruits B on A.id = B.groupMemberId where B.deadLine <= NOW() or ISNULL(B.deadLine)`,
          {
            replacements: [memberId],
            type: QueryTypes.SELECT,
          }
        ),
        sequelize.query(
          `SELECT A.groupId groupId, B.deadLine deadLine FROM (SELECT * FROM joinGroups where groupId IN (SELECT groupId FROM preferGroups where memberId = ?) and position = "L") A LEFT JOIN recruits B on A.id = B.groupMemberId where B.deadLine > NOW()`,
          {
            replacements: [memberId],
            type: QueryTypes.SELECT,
          }
        ),
      ]);

      const [recruitingGroups, recruitedGroups] = await Promise.all([
        Group.findAll({
          where: {
            id: recruitingGroupIds.map((group) => group.groupId),
          },
          attributes: ['id', 'name', 'groupIntro', 'location'],
          include: [
            {
              model: ActiveCategory,
              include: { model: DetailCategory },
            },
            {
              model: PreferGroup,
              attributes: ['type'],
              where: {
                memberId,
              },
            },
          ],
        }),
        Group.findAll({
          where: {
            id: recruitedGroupIds.map((group) => group.groupId),
          },
          attributes: ['id', 'name', 'groupIntro', 'location'],
          include: [
            {
              model: ActiveCategory,
              include: { model: DetailCategory },
            },
            {
              model: PreferGroup,
              attributes: ['type'],
              where: {
                memberId,
              },
            },
          ],
        }),
      ]);

      res.status(200).json({
        recruitingGroups,
        recruitingGroupsDeadLine: recruitingGroupIds.map(
          (group) => group.deadLine
        ),
        recruitedGroups,
        recruitedGroupsDeadLine: recruitedGroupIds.map(
          (group) => group.deadLine
        ),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버에러 입니다.' });
    }
  }

  static async createPreferGroup(req, res) {
    const { memberId, groupId } = req.body;

    try {
      await PreferGroup.create({
        memberId,
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
    const { memberId, groupId } = req.query;
    try {
      await PreferGroup.destroy({
        where: {
          memberId,
          groupId,
        },
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
        where: { memberId: leaderId, position: 'L' },
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
