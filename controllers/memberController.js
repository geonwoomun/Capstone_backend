const { Member, PreferCategory, PreferLocation } = require('../models/member');
const { DetailCategory, Category } = require('../models/category');

module.exports = class MemberController {
  static async getMyInfo(req, res) {
    try {
      if (!req.user) return res.status(200).json(null);

      const myInfo = await Member.findOne({
        where: { id: req.user.id },
        attributes: {
          exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt'],
        },
        include: [
          {
            model: PreferCategory,
            attributes: ['id'],
            include: {
              model: DetailCategory,
              attributes: ['id', 'name'],
              include: { model: Category, attributes: ['id', 'type'] },
            },
          },
          { model: PreferLocation },
        ],
      });

      res.status(200).json({ info: myInfo });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 에러 입니다.' });
    }
  }
  static async getMemberInfo(req, res) {
    const { memberId } = req.params;
    try {
      const memberInfo = await Member.findOne({
        where: { id: memberId },
        attributes: [
          'id',
          'email',
          'name',
          'isProved',
          'gender',
          'telephone',
          'type',
          'declareCount',
        ],
        include: [
          {
            model: PreferCategory,
            attributes: ['id'],
            include: {
              model: DetailCategory,
              attributes: ['id', 'name'],
              include: { model: Category, attributes: ['id', 'type'] },
            },
          },
          { model: PreferLocation },
        ],
      });
      delete memberInfo.password;
      res.status(200).json({ info: memberInfo });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 에러 입니다.' });
    }
  }

  static async updateMemberInfo(req, res) {
    const { memberId, name, telephone, profileImg } = req.body;

    try {
      const memberInfo = await Member.findOne({ where: { id: memberId } });

      await Member.update(
        {
          name: name || memberInfo.name,
          telephone: telephone || memberInfo.telephone,
          profileImg: profileImg || memberInfo.profileImg,
        },
        {
          where: {
            id: memberId,
          },
        }
      );

      res.status(200).json({ message: '유저정보가 업데이트 되었습니다.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 에러입니다.' });
    }
  }

  static async updateCategory(req, res) {
    const { memberId, deleteCategorys = [], newCategorys = [] } = req.body;
    try {
      await Promise.all([
        PreferCategory.destroy({
          where: {
            memberId,
            detailCategoryId: deleteCategorys,
          },
        }),
        PreferCategory.bulkCreate(
          newCategorys.map((categoryId) => ({
            memberId,
            detailCategoryId: categoryId,
          }))
        ),
      ]);

      res
        .status(200)
        .json({ message: '선호 카테고리 업데이트 완료되었습니다.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 에러입니다.' });
    }
  }

  static async updateLocation(req, res) {
    const { memberId, deleteLocations = [], locationAddresses = [] } = req.body;
    try {
      await Promise.all([
        PreferLocation.destroy({
          where: {
            memberId,
            id: deleteLocations,
          },
        }),
        PreferLocation.bulkCreate(
          locationAddresses.map((address) => ({
            address,
          }))
        ),
      ]);

      res.status(200).json({ message: '활동지역 수정이 완료되었습니다.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 에러입니다.' });
    }
  }
};
