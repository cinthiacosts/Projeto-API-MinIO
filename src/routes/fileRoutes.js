const express = require("express");
const multer = require("multer");

const {
  uploadArquivo,
  listarArquivos,
  baixarArquivo
} = require("../controllers/fileController");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage()
});

// POST /upload
router.post("/upload", upload.single("arquivo"), uploadArquivo);

// GET /files
router.get("/files", listarArquivos);

// GET /files/:filename
router.get("/files/:filename", baixarArquivo);

module.exports = router;