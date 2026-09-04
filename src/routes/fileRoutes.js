const express = require("express");
const multer = require("multer");

const {
  uploadArquivo,
  listarArquivos,
  baixarArquivo
} = require("../controllers/fileController");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

// POST /upload
router.post("/upload", (req, res, next) => {
  upload.single("arquivo")(req, res, (erro) => {
    if (erro instanceof multer.MulterError && erro.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        erro: "Arquivo excede o limite máximo de 10 MB"
      });
    }

    if (erro) {
      return res.status(400).json({
        erro: erro.message
      });
    }

    next();
  });
}, uploadArquivo);

// GET /files
router.get("/files", listarArquivos);

// GET /files/:filename
router.get("/files/:filename", baixarArquivo);

module.exports = router;