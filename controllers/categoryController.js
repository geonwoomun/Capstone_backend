const DetailCategory = require('../models/category/detailCategory');
const Category = require('../models/category/category');

module.exports = class CategoryController {
  static async getCategorys(req, res) {
    try {
      const categorys = await Category.findAll({ attributes: ['id', 'type'] });

      res.status(200).json({ categorys });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 에러입니다.' });
    }
  }

  static async getDetailCategorys(req, res) {
    try {
      const detailCategorys = await DetailCategory.findAll({
        attributes: ['id', 'name'],
        include: [{ model: Category, attributes: ['id', 'type'] }],
      });
      res.status(200).json({ detailCategorys });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 에러입니다.' });
    }
  }

  static async getDetailCategory(req, res) {
    const { categoryId } = req.params;
    try {
      const detailCategorys = await DetailCategory.findAll({
        where: {
          categoryId,
        },
        attributes: ['id', 'name'],
        include: [{ model: Category, attributes: ['id', 'type'] }],
      });
      res.status(200).json({ detailCategorys });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 에러입니다.' });
    }
  }
};
