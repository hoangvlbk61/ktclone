const { Router } = require("express");
const headerMiddleware = require("../middleware/header-middleware");

const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const fs = require("fs");
const FileDb = require("../persistence/file");
const path = require("path");

const router = new Router();

const imgDir = path.join(__dirname, "../../images");

const createFileDirIfNotExist = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
};

const getFileExt = (filename) => filename.split(".").pop();

createFileDirIfNotExist(imgDir);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userId = req.userId;
    // const userDir = path.join(imgDir, userId);
    const userDir = path.join(imgDir);
    createFileDirIfNotExist(userDir);
    cb(null, userDir);
  },
  filename: function (req, file, cb) {
    const fileOriginName = file.originalname;
    const ext = getFileExt(fileOriginName);
    const fileId = uuidv4();
    req.fileId = fileId;
    req.fileExt = ext;
    const multeruuid = `${fileId}.${ext}`;
    cb(null, multeruuid);
  },
});

const upload = multer({ storage: storage });
router.use(headerMiddleware);
router.post("", upload.single("file"), async (request, response) => {
  try {
    const fileId = request.fileId;
    const fileExt = request.fileExt;
    const userId = request.userId;
    const fid = await FileDb.create(fileId, userId, fileExt);
    if (fid) return response.status(201).json({ fileId: fileId });
    else return response.status(500).json({ message: "Unknown error" });
  } catch (error) {
    console.log("POST >> File", error);
    response.status(500).json();
  }
});

router.get("/:fileId", async (request, response) => {
  const { fileId } = request.params;
  try {
    const file = await FileDb.find(fileId);
    if (!file) return response.status(404).end();
    const { id, user_id, ext } = file;
    const fileName = `${id}.${ext}`;
    // const imgPath = path.join(imgDir, user_id, fileName);
    const imgPath = path.join(imgDir, fileName);
    const fStr = fs.createReadStream(imgPath);
    fStr.on("error", () => {
      response.status(500).json();
      return;
    });
    fStr.pipe(response);
  } catch (error) {
    console.log(`GET >> File ${fileId}`, error);
    response.status(500).json();
  }
});

router.delete("/:fileId", async (request, response) => {
  const { fileId } = request.params;
  try {
    const file = await FileDb.find(fileId);
    if (!file) return response.status(404).end();
    const { id, user_id, ext } = file;
    const fileName = `${id}.${ext}`;
    const imgPath = path.join(imgDir, fileName);
    await FileDb.delete(id);
    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    response.status(204).end();
  } catch (error) {
    console.log(`DELETE >> File ${fileId}`, error);
    response.status(500).json();
  }
});

module.exports = router;
