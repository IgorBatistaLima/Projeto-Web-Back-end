# Projeto Final 

## Descrição

Esse projeto foi desenvolvido para o trabalho final da disciplina de PROGRAMAÇÃO WEB BACK-END do curso Analise e Desenvolvimeto 
Sistemas Da Universidade Federal Tecnologica do Parana (UTFPR). Esse projeto é uam aplicação back end para criação de postagens


## Instalação

Instruções para instalar o projeto. Por exemplo:

1. Clone o repositório: `git clone https://github.com/username/repo.git`
2. Entre no diretório do projeto: `cd repo`
3. De um init: `npm init`
4. Instale as dependências: `npm install`
5. No arquivo .env coloque url do seu banco e sua chave secrta
6. use MongoDB

DATABASE_URL = mongodb+srv://user:senha@cluster0.j9tun0k.mongodb.net/

SECRET_KEY = "Chave Secreta"

## Uso

Utileze Mongodb, tenha instalado postman insomnia

### Rotas da API

- `GET /posts/find-all/:limmit/:page`: Retorna uma lista de postagens, com paginação.
- `POST /posts/create`: Cria uma nova postagem.
- `PUT /posts/update`: Atualiza uma postagem existente.
- `DELETE /posts/delete`: Deleta o post

- `POST /category/create`: Cria uma categoria
- `GET /category/`: Mostra as categorias
- `DELETE /category/delete`: deleta uma categoria

- `POST /comments/create`: Cria um comentario
- `GET /comments/find-all`: Mostra os comentarios
- `PUT /comments/update`: Atuliza o comentario
- `DELETE /category/delete`: deleta o comentario

- `POST /login`:Faz login
- `POST /register`:Faz o registro

- `POST /admin/create`: admin cria um novo usuario
- `DELETE /admin/delete`:deleta um usuario
- `PUT /admin/update`: atualiza um usuario

- `GET /install`: realiza a instalação do banco
de dados

-`GET /docs`: a documentação gerada pela ferramenta Swagger
