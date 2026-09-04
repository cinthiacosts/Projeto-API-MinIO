# Testes da API

Esta pasta contém os arquivos utilizados para testar os endpoints da API de armazenamento de objetos com Node.js e MinIO.

## Testes realizados

- `POST /upload` — envio de arquivo para o MinIO.
- `GET /files` — listagem dos arquivos armazenados.
- `GET /files/:filename` — recuperação e download de arquivo.
- Upload sem arquivo — retorno `400 Bad Request`.
- Arquivo inexistente — retorno `404 Not Found`.
- Arquivo acima de 10 MB — retorno `413 Payload Too Large`.

## Ferramenta utilizada

Os testes foram realizados com a extensão REST Client no Visual Studio Code, utilizando o arquivo:

`api-minio.http`

## Validação de tamanho

A API possui limite máximo de 10 MB por upload.

Durante a validação, foi utilizado um arquivo de 11 MB. A API recusou corretamente o envio e retornou:

`413 Payload Too Large`

Mensagem:

`Arquivo excede o limite máximo de 10 MB`

O arquivo de 11 MB foi utilizado somente para validação e não faz parte do repositório.