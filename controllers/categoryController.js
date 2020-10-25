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

  static async createCategory(req, res) {
    const { type } = req.body;
    try {
      await Category.create({
        type,
      });
      res.status(200).json({ message: '카테고리 생성 성공' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 에러입니다.' });
    }
  }

  static async createDetailCategory(req, res) {
    const { name, categoryId } = req.body;
    try {
      await DetailCategory.create({
        name,
        categoryId,
      });

      res.status(200).json({ message: '세부카테고리 생성 성공' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 에러입니다.' });
    }
  }
};
