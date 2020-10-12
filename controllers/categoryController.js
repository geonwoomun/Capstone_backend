const DetailCategory = require('../models/category/detailCategory');
const Category = require('../models/category/category');

module.exports = class CategoryController {
  static async getCategorys(req, res) {
    try {
      const categorys = await Category.findAll();

      res.status(200).json({ categorys });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 에러입니다.' });
    }
  }

  static async getDetailCategorys(req, res) {
    const { categoryId } = req.params;
    try {
      const detailCategorys = await DetailCategory.findAll(
        {
          include: [{ model: Category }],
        },
        {
          where: {
            categoryId,
          },
        }
      );
      res.status(200).json({ detailCategorys });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 에러입니다.' });
    }
  }
};
