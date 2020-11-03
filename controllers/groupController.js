const {
  ActiveTime,
  Group,
  GroupImage,
  Skill,
  ActiveCategory,
} = require('../models/group');
const { DetailCategory, Category } = require('../models/category');
const { JoinGroup } = require('../models/groupMember');
const { Member } = require('../models/member');
const { Op } = require('sequelize');
// 그룹 관련된 이미지랑, 스킬, 해시태그, 활동시간 등을 같이 준다고 하면...
// bulkcreate

module.exports = class GroupController {
  static async getGroups(req, res) {
    try {
      const groups = await Group.findAll({
        attributes: ['id', 'name', 'memberCount', 'groupIntro', 'location'],
        include: [
          { model: Skill, attributes: ['id', 'name'] },
          {
            model: ActiveTime,
            attributes: ['id', 'activeDay', 'startTime', 'endTime'],
          },
          { model: GroupImage, attributes: ['id', 'URL', 'description'] },
          {
            model: ActiveCategory,
            include: [
              {
                model: DetailCategory,
                attributes: ['id', 'name'],
                include: { model: Category, attributes: ['id', 'type'] },
              },
            ],
          },
        ],
      });

      res.status(200).json({ groups });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 에러입니다.' });
    }
  }

  static async getGroup(req, res) {
    const { groupId } = req.params;
    try {
      const group = await Group.findOne({
        where: {
          id: groupId,
        },
        attributes: ['id', 'name', 'memberCount', 'groupIntro', 'location'],
        include: [
          {
            model: JoinGroup,
            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
            where: {
              position: 'L',
            },
            include: {
              model: Member,
              attributes: ['id', 'email', 'name', 'profileImg'],
            },
          },
          { model: Skill, attributes: ['id', 'name'] },
          {
            model: ActiveTime,
            attributes: ['id', 'activeDay', 'startTime', 'endTime'],
          },
          { model: GroupImage, attributes: ['id', 'URL', 'description'] },
          {
            model: ActiveCategory,
            include: [
              {
                model: DetailCategory,
                attributes: ['id', 'name'],
                include: { model: Category, attributes: ['id', 'type'] },
              },
            ],
          },
        ],
      });

      res.status(200).json({ group });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 에러입니다.' });
    }
  }

  static async createGroup(req, res) {
    const {
      memberId,
      groupName,
      groupIntro,
      maxMember,
      activeTimes = [],
      location,
      skills = [],
      groupImages = [],
      detailCategoryId = [],
    } = req.body;
    try {
      const isExistGroup = await Group.findOne({ where: { name: groupName } });

      if (isExistGroup)
        return res.status(400).json({ message: '존재하는 그룹 명입니다.' });

      const groupData = await Group.create({
        name: groupName,
        location,
        groupIntro,
        maxMember,
        memberCount: 1,
      });

      // 활동시간, 스킬, 그룹이미지
      await Promise.all([
        await ActiveTime.bulkCreate(
          activeTimes.map((time) => ({ ...time, groupId: groupData.id }))
        ),
        await Skill.bulkCreate(
          skills.map((skill) => ({ ...skill, groupId: groupData.id }))
        ),
        await GroupImage.bulkCreate(
          groupImages.map((groupImage) => ({
            ...groupImage,
            groupId: groupData.id,
          }))
        ),
        await JoinGroup.create({
          position: 'L',
          groupId: groupData.id,
          memberId,
        }),
        await ActiveCategory.bulkCreate(
          detailCategoryId.map((id) => ({
            detailCategoryId: id,
            groupId: groupData.id,
          }))
        ),
      ]);

      res
        .status(201)
        .json({ message: '그룹이 생성 되었습니다.', groupId: groupData.id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 에러입니다.' });
    }
  }

  static async updateGroup(req, res) {
    const {
      groupId,
      memberId,
      groupName,
      groupIntro,
      groupImages = [],
      activeTimes = [],
      skills = [],
      detailCategoryIds = [],
    } = req.body;

    // 유저가 groupId의 팀장이 아니면 패스.
    try {
      const isLeader = await JoinGroup.findOne({
        where: { groupId, memberId, position: 'L' },
      });

      if (!isLeader) {
        return res.status(400).json({ message: '그룹장이 아닙니다.' });
      }

      const groupInfo = await Group.findOne({ where: { id: groupId } });

      const { oldGroupImageIds, newGroupImages } = groupImages.reduce(
        (total, groupImage) => {
          if (groupImage.id) total.oldGroupImageIds.push(groupImage.id);
          if (!groupImage.id) total.newGroupImages.push(groupImage);
          return total;
        },
        { oldGroupImageIds: [], newGroupImages: [] }
      );

      const { oldActiveTimeIds, newActiveTimes } = activeTimes.reduce(
        (total, activeTime) => {
          if (activeTime.id) total.oldActiveTimeIds.push(activeTime.id);
          if (!activeTime.id) total.newActiveTimes.push(activeTime);
          return total;
        },
        { oldActiveTimeIds: [], newActiveTimes: [] }
      );

      const { oldSkillIds, newSkills } = skills.reduce(
        (total, skill) => {
          if (skill.id) total.oldSkillIds.push(skill.id);
          if (!skill.id) total.newSkills.push(skill);
          return total;
        },
        { oldSkillIds: [], newSkills: [] }
      );
      await Group.update(
        {
          groupName: groupName || groupInfo.groupName,
          groupIntro: groupIntro || groupInfo.groupIntro,
        },
        { where: { id: groupId } }
      );

      await Promise.all([
        GroupImage.destroy({
          where: {
            groupId,
            id: {
              [Op.notIn]: oldGroupImageIds,
            },
          },
        }),
        ActiveTime.destroy({
          where: {
            groupId,
            id: {
              [Op.notIn]: oldActiveTimeIds,
            },
          },
        }),
        Skill.destroy({
          where: {
            groupId,
            id: {
              [Op.notIn]: oldSkillIds,
            },
          },
        }),
        ActiveCategory.destroy({
          where: {
            groupId,
            detailCategoryId: {
              [Op.notIn]: detailCategoryIds,
            },
          },
        }),
        ActiveTime.bulkCreate(
          newActiveTimes.map((time) => ({ ...time, groupId }))
        ),
        GroupImage.bulkCreate(
          newGroupImages.map((groupImage) => ({ ...groupImage, groupId }))
        ),
        Skill.bulkCreate(newSkills.map((skill) => ({ ...skill, groupId }))),
        ...detailCategoryIds.map((detailCategoryId) =>
          ActiveCategory.findOrCreate({
            where: {
              groupId,
              detailCategoryId,
            },
          })
        ),
      ]);

      res.status(200).json({ message: '그룹의 정보가 변경 되었습니다.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 에러입니다.' });
    }
  }

  static async deleteGroup(req, res) {
    const { groupId, memberId } = req.query;

    try {
      const isLeader = await JoinGroup.findOne({
        where: { groupId, memberId, position: 'L' },
      });

      if (!isLeader) {
        return res.status(400).json({ message: '그룹장이 아닙니다.' });
      }

      await Promise.all([
        await Group.destroy({ where: { id: groupId } }),
        await JoinGroup.destroy({ where: { groupId, memberId } }),
      ]);
      res.status(200).json({ message: '그룹이 삭제되었습니다.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 에러입니다.' });
    }
  }
};
