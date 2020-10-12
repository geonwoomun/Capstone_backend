const Group = require('../models/group/group');
const ActiveTime = require('../models/group/activeTime');
const Skill = require('../models/group/activeTime');
const GroupImage = require('../models/group/activeTime');
// 그룹 관련된 이미지랑, 스킬, 해시태그, 활동시간 등을 같이 준다고 하면...
// bulkcreate

module.exports = class GroupController {
  static async getGroup(req, res) {
    try {
      const groups = await Group.findAll();

      res.status(200).json({ groups });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 에러입니다.' });
    }
  }

  static async createGroup(req, res) {
    const {
      groupName,
      groupIntro,
      activeTimes,
      skills,
      groupImages,
    } = req.body;
    try {
      const isExistGroup = await Group.findOne({ where: { name: groupName } });

      if (isExistGroup)
        return res.status(400).json({ message: '존재하는 그룹 명입니다.' });

      const groupData = await Group.create({
        name: groupName,
        groupIntro,
      });

      // 활동시간, 스킬, 그룹이미지
      await ActiveTime.bulkCreate(
        activeTimes.map((time) => ({ ...time, groupId: groupData.id }))
      );
      await Skill.bulkCreate(
        skills.map((skill) => ({ ...skill, groupId: groupData.id }))
      );
      await GroupImage.bulkCreate(
        groupImages.map((groupImage) => ({
          ...groupImage,
          groupId: groupData.id,
        }))
      );

      res.status(201).json({ message: '그룹이 생성 되었습니다.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 에러입니다.' });
    }
  }

  static async updateGroup(req, res) {
    const {
      groupId,
      userId,
      groupName,
      groupIntro,
      groupImages,
      activeTimes,
      skills,
      deleteGroupImages,
      deleteActiveTimes,
      deleteSkiils,
    } = req.body;

    // 유저가 groupId의 팀장이 아니면 패스.
    try {
      await Group.update({ groupName, groupIntro }, { where: groupId, userId });

      await Promise.all([
        GroupImage.destroy({
          where: { $in: deleteGroupImages.map((groupImage) => groupImage.id) },
        }),
        ActiveTime.destroy({
          where: { $in: deleteActiveTimes.map((activeTime) => activeTime.id) },
        }),
        Skill.destroy({
          where: { $in: deleteSkiils.map((skill) => skill.id) },
        }),
      ]);

      // 병렬적으로 가능?
      await Promise.all([
        ActiveTime.bulkCreate(
          activeTimes.map((time) => ({ ...time, groupId }))
        ),
        GroupImage.bulkCreate(
          groupImages.map((groupImage) => ({ ...groupImage, groupId }))
        ),
        Skill.bulkCreate(skills.map((skill) => ({ ...skill, groupId }))),
      ]);

      res.status(200).json({ message: '그룹의 정보가 변경 되었습니다.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 에러입니다.' });
    }
  }

  static async deleteGroup(req, res) {
    const { groupId } = req.params;

    try {
      await Group.destroy({ where: { id: groupId } });

      res.status(200).json({ message: '그룹이 삭제되었습니다.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 에러입니다.' });
    }
  }
};
