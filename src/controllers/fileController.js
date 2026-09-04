const {
  PutObjectCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
  GetObjectCommand
} = require("@aws-sdk/client-s3");

const {
  s3,
  bucketName
} = require("../config/s3");

// Upload de arquivo
async function uploadArquivo(req, res) {
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
}

// Listagem de arquivos
async function listarArquivos(req, res) {
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
}

// Download de arquivo
async function baixarArquivo(req, res) {
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
}

module.exports = {
  uploadArquivo,
  listarArquivos,
  baixarArquivo
};