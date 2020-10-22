module.exports = class ImageController {
  static async uploadImages(req, res) {
    const urls = req.files.map((file) => file.location);
    res.json({ urls, message: '이미지 업로드 성공하였습니다.' });
  }
};
