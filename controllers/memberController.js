const { Member, PreferCategory, PreferLocation } = require('../models/member');

module.exports = class MemberController {
  static async getMemberInfo(req, res) {
    const { memberId } = req.params;
    try {
      const memberInfo = await Member.findOne(
        { include: [{ model: PreferCategory }, { model: PreferLocation }] },
        { where: { id: memberId } }
      );
      delete memberInfo.password;
      res.status(200).json({ info: memberInfo });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 에러 입니다.' });
    }
  }

  static async updateMemberInfo(req, res) {
    const {
      memberId,
      name,
      birthday,
      gender,
      email,
      telephone,
      profileImg,
    } = req.body;

    try {
      await Member.update(
        { name, birthday, gender, email, telephone, profileImg },
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
    const { memberId, deleteCategorys, newCategorys } = req.body;
    try {
      await Promise.all([
        PreferCategory.destroy({
          where: {
            memberId,
            id: deleteCategorys,
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

  static async updateLocation() {
    const { memberId, deleteLocations, locationAddresses } = req.body;
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
