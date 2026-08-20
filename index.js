const express = require("express");
const multer = require("multer");
const Minio = require("minio");

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

const minioClient = new Minio.Client({
  endPoint: "localhost",
  port: 9000,
  useSSL: false,
  accessKey: "minioadmin",
  secretKey: "minioadmin"
});

const bucketName = "arquivos";

async function garantirBucket() {
  const existe = await minioClient.bucketExists(bucketName);

  if (!existe) {
    await minioClient.makeBucket(bucketName);
    console.log("Bucket criado:", bucketName);
  }
}

app.post("/upload", upload.single("arquivo"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        erro: "Nenhum arquivo foi enviado"
      });
    }

    await minioClient.putObject(
      bucketName,
      req.file.originalname,
      req.file.buffer,
      req.file.size
    );

    res.status(201).json({
      mensagem: "Arquivo enviado com sucesso",
      arquivo: req.file.originalname
    });
  } catch (erro) {
    res.status(500).json({
      erro: erro.message
    });
  }
});

app.get("/arquivos", async (req, res) => {
  try {
    const arquivos = [];
    const stream = minioClient.listObjects(bucketName, "", true);

    stream.on("data", (objeto) => {
      arquivos.push({
        nome: objeto.name,
        tamanho: objeto.size,
        ultimaModificacao: objeto.lastModified
      });
    });

    stream.on("end", () => {
      res.json(arquivos);
    });

    stream.on("error", (erro) => {
      res.status(500).json({
        erro: erro.message
      });
    });
  } catch (erro) {
    res.status(500).json({
      erro: erro.message
    });
  }
});

async function iniciar() {
  try {
    await garantirBucket();

    app.listen(3000, () => {
      console.log("API rodando em http://localhost:3000");
    });
  } catch (erro) {
    console.error("Erro ao conectar ao MinIO:", erro.message);
  }
}

iniciar();