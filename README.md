# API de Armazenamento de Objetos com Node.js e MinIO

Trabalho prático desenvolvido na disciplina de DevOps e Segurança da Informação do curso de Análise e Desenvolvimento de Sistemas.

O projeto consiste em uma API REST desenvolvida em Node.js para armazenamento de objetos utilizando MinIO, executado em container Docker e acessado através do protocolo compatível com Amazon S3.

## Integrantes

- Cinthia Raquel Ferreira da Costa
- Alex Farias Bentes
- Ricardo Victor Batista do Nascimento Cardoso

**Curso:** Análise e Desenvolvimento de Sistemas  
**Período:** 4º período  
**Unidade:** Adrianópolis  
**Turno:** Noturno  

---

## Objetivo

Desenvolver uma API REST capaz de realizar operações de armazenamento de objetos utilizando Node.js e MinIO.

A aplicação permite:

- enviar arquivos para um bucket;
- listar os arquivos armazenados e seus metadados;
- recuperar e realizar o download dos arquivos;
- manter os objetos persistidos através de volume Docker.

---

## Tecnologias utilizadas

- Node.js
- Express
- Multer
- AWS SDK for JavaScript v3
- MinIO
- Docker
- Docker Compose
- REST Client
- Git
- GitHub

---

## Arquitetura da aplicação

O fluxo principal da aplicação é:

```text
Cliente HTTP
     |
     v
API REST Node.js
     |
     v
AWS SDK (S3)
     |
     v
MinIO em Docker
     |
     v
Bucket "arquivos"
     |
     v
Volume persistente
```

O MinIO fornece uma API compatível com o protocolo S3. A aplicação Node.js utiliza o AWS SDK para realizar as operações de armazenamento.

---

## Estrutura do projeto

```text
Projeto-API-MinIO/
│
├── src/
│   ├── config/
│   │   └── s3.js
│   ├── controllers/
│   │   └── fileController.js
│   └── routes/
│       └── fileRoutes.js
│
├── tests/
│   ├── api-minio.http
│   ├── README.md
│   └── teste-correto.txt
│
├── docs/
│   └── README.md
│
├── .env.example
├── .gitignore
├── docker-compose.yml
├── index.js
├── package.json
├── package-lock.json
└── README.md
```

### Organização dos módulos

**`src/config/s3.js`**  
Responsável pela configuração da conexão S3/MinIO e pela verificação e criação automática do bucket.

**`src/controllers/fileController.js`**  
Contém a lógica de upload, listagem e recuperação dos arquivos.

**`src/routes/fileRoutes.js`**  
Define as rotas HTTP disponibilizadas pela API.

**`index.js`**  
Inicializa a aplicação Express e realiza a conexão com os módulos da aplicação.

---

## Pré-requisitos

Para executar o projeto é necessário possuir:

- Node.js;
- npm;
- Docker Desktop;
- Git.

Para executar a coleção de testes pelo VS Code, pode ser utilizada a extensão REST Client.

---

## Configuração

Clone o repositório:

```bash
git clone https://github.com/cinthiacosts/Projeto-API-MinIO.git
```

Entre na pasta:

```bash
cd Projeto-API-MinIO
```

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env` com base no `.env.example`.

Exemplo:

```env
S3_ENDPOINT=http://localhost:9000
S3_REGION=us-east-1
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET=arquivos
PORT=3000

MINIO_API_PORT=9000
MINIO_CONSOLE_PORT=9001
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin
```

O arquivo `.env` não deve ser enviado ao repositório.

---

## Executando o MinIO

Com o Docker Desktop em execução, utilize:

```bash
docker compose up -d
```

O MinIO ficará disponível nas portas:

- API S3: `9000`;
- Console Web: `9001`.

Os dados são armazenados em volume Docker para garantir persistência.

Para encerrar os containers:

```bash
docker compose down
```

---

## Executando a API

Com o MinIO em execução:

```bash
npm start
```

Quando a conexão estiver correta, o terminal deverá apresentar:

```text
Bucket já existe: arquivos
API rodando em http://localhost:3000
```

Caso o bucket ainda não exista, a aplicação realiza sua criação automaticamente.

---

## Endpoints

### POST /upload

Realiza o envio de um arquivo para o bucket do MinIO.

**Método:** `POST`

**URL:**

```text
http://localhost:3000/upload
```

O arquivo deve ser enviado utilizando `multipart/form-data`, no campo:

```text
arquivo
```

Exemplo de resposta:

```json
{
  "mensagem": "Arquivo enviado com sucesso",
  "arquivo": "teste-correto.txt"
}
```

### GET /files

Lista os arquivos armazenados no bucket e seus metadados.

**Método:** `GET`

**URL:**

```text
http://localhost:3000/files
```

Exemplo de resposta obtida durante o teste:

```json
[
  {
    "nome": "teste-correto.txt",
    "tamanho": 24,
    "data": "2026-09-04T19:39:23.466Z",
    "contentType": "text/plain"
  }
]
```

São retornados:

- nome;
- tamanho;
- data da última modificação registrada pelo armazenamento;
- content-type.

### GET /files/:filename

Recupera um arquivo armazenado no bucket.

**Método:** `GET`

Exemplo:

```text
http://localhost:3000/files/teste-correto.txt
```

A resposta utiliza o `Content-Type` armazenado e disponibiliza o objeto para download.

---

## Testes

Os testes da API estão disponíveis em:

```text
tests/api-minio.http
```

A coleção pode ser executada utilizando a extensão REST Client do VS Code.

Foram validados os seguintes cenários:

1. envio de arquivo através de `POST /upload`;
2. listagem dos objetos e metadados através de `GET /files`;
3. recuperação do objeto através de `GET /files/:filename`.

Nos testes realizados com o arquivo `teste-correto.txt`, foram obtidas as seguintes respostas:

```text
POST /upload                  -> HTTP 201 Created
GET /files                    -> HTTP 200 OK
GET /files/teste-correto.txt  -> HTTP 200 OK
```

Na listagem, o arquivo utilizado no teste apresentou:

```text
Nome: teste-correto.txt
Tamanho: 24 bytes
Content-Type: text/plain
```

A recuperação retornou corretamente o conteúdo armazenado:

```text
Teste final da API MinIO
```

---

## Persistência

O `docker-compose.yml` utiliza um volume chamado:

```text
minio_data
```

Dessa forma, os objetos armazenados permanecem disponíveis após parar e iniciar novamente o container.

---

## Divisão das atividades

### Cinthia Raquel Ferreira da Costa

- organização do repositório;
- configuração inicial do projeto Node.js;
- configuração do Docker e MinIO;
- integração com AWS SDK S3;
- implementação inicial do upload;
- configuração das variáveis de ambiente;
- organização e integração da estrutura modular;
- documentação e integração final.

### Alex Farias Bentes

- requisito referente à listagem de arquivos;
- definição dos metadados retornados pelo endpoint `GET /files`;
- apoio na fundamentação teórica do trabalho.

### Ricardo Victor Batista do Nascimento Cardoso

- requisito referente à recuperação de arquivos;
- requisito referente ao endpoint `GET /files/:filename`;
- apoio nos testes de recuperação dos objetos.

A integração e consolidação final das funcionalidades foram realizadas no repositório principal da equipe.

---

## Endereços utilizados

| Serviço | Endereço |
|---|---|
| API Node.js | `http://localhost:3000` |
| MinIO API | `http://localhost:9000` |
| MinIO Console | `http://localhost:9001` |

---

## Documentação

O artigo técnico e os demais documentos do trabalho serão disponibilizados na pasta:

```text
docs/
```

---

## Status

As funcionalidades principais da API foram implementadas e validadas:

- [x] ambiente MinIO com Docker Compose;
- [x] persistência por volume;
- [x] criação automática do bucket;
- [x] upload de arquivos;
- [x] listagem de arquivos e metadados;
- [x] recuperação/download;
- [x] estrutura modular;
- [x] variáveis de ambiente;
- [x] coleção de testes REST Client;
- [ ] artigo técnico final em PDF;
- [ ] documentação das evidências e métricas;
- [ ] apresentação técnica.