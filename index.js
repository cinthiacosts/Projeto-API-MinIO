require("dotenv").config();

const express = require("express");

const fileRoutes = require("./src/routes/fileRoutes");
const { garantirBucket } = require("./src/config/s3");

const app = express();

app.use(fileRoutes);

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