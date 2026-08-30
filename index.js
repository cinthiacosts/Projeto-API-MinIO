const express = require("express");
const multer = require("multer");

const {
  S3Client,
  HeadBucketCommand,
  CreateBucketCommand,
  PutObjectCommand,
  ListObjectsV2Command
} = require("@aws-sdk/client-s3");

const app = express();

const upload = multer({
  storage: multer.memoryStorage()
});

const s3 = new S3Client({
  region: "us-east-1",
  endpoint: "http://localhost:9000",
  credentials: {
    accessKeyId: "minioadmin",
    secretAccessKey: "minioadmin"
  },
  forcePathStyle: true
});

const bucketName = "arquivos";

async function garantirBucket() {
  try {
    await s3.send(
      new HeadBucketCommand({
        Bucket: bucketName
      })
    );

    console.log("Bucket já existe:", bucketName);
  } catch (erro) {
    await s3.send(
      new CreateBucketCommand({
        Bucket: bucketName
      })
    );

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

    await s3.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: req.file.originalname,
        Body: req.file.buffer,
        ContentType: req.file.mimetype
      })
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
    const resposta = await s3.send(
      new ListObjectsV2Command({
        Bucket: bucketName
      })
    );

    const arquivos = (resposta.Contents || []).map((objeto) => ({
      nome: objeto.Key,
      tamanho: objeto.Size,
      ultimaModificacao: objeto.LastModified
    }));

    res.json(arquivos);
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

