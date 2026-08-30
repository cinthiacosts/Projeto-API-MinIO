# API de Armazenamento de Objetos com Node.js e MinIO

Trabalho prático desenvolvido na disciplina de DevOps e Segurança da Informação do curso de Análise e Desenvolvimento de Sistemas.

## Integrantes

- Cinthia Raquel Ferreira da Costa
- Alex Farias Bentes
- Ricardo Victor Batista do Nascimento Cardoso

**Curso:** Análise e Desenvolvimento de Sistemas  
**Período:** 4º período  
**Unidade:** Adrianópolis  
**Turno:** Noturno  

## Objetivo

O objetivo do projeto é desenvolver uma API REST em Node.js integrada a um servidor de armazenamento de objetos MinIO, executado através de containers Docker e compatível com o protocolo S3.

A aplicação permitirá realizar o envio, a listagem e a recuperação de arquivos armazenados em um bucket do MinIO.

## Funcionalidades

- `POST /upload` — envio de arquivos para o bucket;
- `GET /files` — listagem dos arquivos armazenados e seus metadados;
- `GET /files/:filename` — recuperação ou download de um arquivo.

## Tecnologias utilizadas

- Node.js
- Express
- Multer
- AWS SDK for JavaScript (S3)
- MinIO
- Docker
- Docker Compose
- Git
- GitHub

## Divisão das atividades

### Cinthia Raquel Ferreira da Costa

- Organização inicial do repositório;
- Configuração do projeto Node.js;
- Configuração do Docker e MinIO;
- Integração com AWS SDK S3;
- Implementação inicial da rota `POST /upload`;
- Organização inicial da documentação.

### Alex Farias Bentes

- Implementação da rota `GET /files`;
- Listagem dos metadados dos objetos;
- Apoio na fundamentação teórica do artigo.

### Ricardo Victor Batista do Nascimento Cardoso

- Implementação da rota `GET /files/:filename`;
- Download ou geração de URL pré-assinada;
- Testes das rotas e registro dos resultados.

## Instalação das dependências

```bash
npm install
```