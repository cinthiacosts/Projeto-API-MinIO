require("dotenv").config();

const express = require("express");
const multer = require("multer");

const {
  S3Client,
  HeadBucketCommand,
  CreateBucketCommand,
  PutObjectCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
  GetObjectCommand
} = require("@aws-sdk/client-s3");

const app = express();

const upload = multer({
  storage: multer.memoryStorage()
});

const s3 = new S3Client({
  region: process.env.S3_REGION,
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY
  },
  forcePathStyle: true
});

const bucketName = process.env.S3_BUCKET;

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

// Cinthia - envio de arquivos
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

// Parte atribuída ao Alex - listagem de arquivos
app.get("/files", async (req, res) => {
  try {
    const resposta = await s3.send(
      new ListObjectsV2Command({
        Bucket: bucketName
      })
    );

    const arquivos = await Promise.all(
      (resposta.Contents || []).map(async (objeto) => {
        const metadados = await s3.send(
          new HeadObjectCommand({
            Bucket: bucketName,
            Key: objeto.Key
          })
        );

        return {
          nome: objeto.Key,
          tamanho: objeto.Size,
          data: objeto.LastModified,
          contentType: metadados.ContentType || "application/octet-stream"
        };
      })
    );

    res.json(arquivos);
  } catch (erro) {
    res.status(500).json({
      erro: erro.message
    });
  }
});

// Parte atribuída ao Ricardo - recuperação/download de arquivo
app.get("/files/:filename", async (req, res) => {
  try {
    const filename = req.params.filename;

    const resposta = await s3.send(
      new GetObjectCommand({
        Bucket: bucketName,
        Key: filename
      })
    );

    res.setHeader(
      "Content-Type",
      resposta.ContentType || "application/octet-stream"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}"`
    );

    resposta.Body.pipe(res);
  } catch (erro) {
    const status =
      erro.$metadata?.httpStatusCode === 404 || erro.name === "NoSuchKey"
        ? 404
        : 500;

    res.status(status).json({
      erro:
        status === 404
          ? "Arquivo não encontrado"
          : erro.message
    });
  }
});

async function iniciar() {
  try {
    await garantirBucket();

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`API rodando em http://localhost:${PORT}`);
    });
  } catch (erro) {
    console.error("Erro ao conectar ao MinIO:", erro.message);
  }
}

iniciar();