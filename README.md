
# Projeto Web Back-end

## Especificação do Sistema

O projeto web desenvolvido nesta disciplina tem como objetivo aplicar os conceitos e temas abordados em aula. O domínio do sistema é de livre escolha do aluno, desde que atenda aos requisitos definidos a seguir. O projeto pode envolver trabalhos de outras disciplinas, o início de um TCC ou projetos pessoais. O trabalho pode ser desenvolvido individualmente ou em duplas, mas a avaliação será individual, considerando os commits realizados e a apresentação individual.

### Tecnologias

O projeto utilizará as seguintes tecnologias:

- **Framework:** Express, juntamente com os pacotes apresentados em sala de aula. A utilização de ferramentas adicionais deve ser consultada para evitar penalidades.
- **Banco de dados:** Livre escolha entre um banco de dados relacional (ex. MySQL ou PostgreSQL) utilizando Sequelize ou o banco de dados NoSQL MongoDB com Mongoose.
- **API:** Todas as funcionalidades devem ser implementadas em formato de API REST, sem a necessidade de desenvolvimento de uma interface. Testes devem ser realizados usando ferramentas como Nodemon, Insomnia, Talend, etc.

### Usuários e Sistema de Autenticação (30%)

#### Funcionalidades:

1. Cadastro de usuários com dados pessoais e credenciais (usuário e senha) para autenticação na API.
2. Usuários administradores com privilégios específicos, como alterar, excluir outros usuários e criar administradores. A instalação do sistema cria um usuário administrador por padrão.
3. Rota para que administradores criem outros administradores.
4. Rota para que administradores excluam um usuário não administrador.
5. Rota de login que gera um token JWT para acesso às rotas protegidas da API.
6. Usuários podem alterar seus dados pessoais por meio de uma rota específica. Usuários comuns não podem alterar dados de outros usuários, mas administradores podem.

### Sistema CRUD (30%)

O sistema deve permitir a realização de 3 (individual) ou 4 (dupla) operações de CRUD, com relacionamentos entre eles (um-para-muitos ou muitos-para-muitos). Operações de inserção, alteração e exclusão devem ser restritas ao usuário autenticado no sistema. O acesso para listar e buscar pelo identificador único é de livre escolha do desenvolvedor.

#### Validações:

- Validação adequada dos dados fornecidos pelo usuário.
- Mensagens de erros personalizadas.
- Mensagens de erros e sucessos enviadas com as respostas.
- Uso dos métodos HTTP GET, POST, PUT e DELETE conforme a operação.

#### Listagem:

- Implementação de paginação dos dados nas operações de listar.
- Parâmetros de limite e página para controlar a quantidade de objetos retornados.

### Lógica de Negócio, Instalador e Documentação (40%)

#### Lógica de Negócio:

- Implementação de uma operação especial disponível por uma ou mais rotas.
- Envolvimento de inserção/alteração no banco de dados, geração de consultas elaboradas e/ou processamento dos dados.

#### Instalador:

- Rota GET /install/ para a instalação do banco de dados (criação de tabelas/coleções e inserção de dados).
- Cada tabela/coleção deve ser populada com pelo menos 5 registros.

#### Documentação:

- Rota GET /docs contendo a documentação gerada pela ferramenta Swagger.

### Prazos de Entrega

A entrega será agendada a partir da semana de 27 de novembro. O agendamento prévio via Moodle é necessário, e o não cumprimento resultará em desconto na nota. Em caso de capacidade insuficiente para avaliação, os não atendidos deverão apresentar na próxima aula.

### Considerações Finais

- Desenvolvimento da API pode ser individual ou em duplas.
- Trabalhos similares ou plágio resultarão em nota zero.
- Apresentação ao professor e ajustes em tempo real podem ser necessários.
- Código disponível em repositório GIT com commits incrementais.
- Uso do arquivo .env para configurações do banco de dados (utilize dotenv).
- Organização da arquitetura do projeto e definição de rotas são critérios avaliados.
- Explicação do código é obrigatória durante a apresentação.
- Evitar uso de pacotes e ferramentas não abordados em aula sem prévia ciência do professor.
- Dúvidas e questões serão resolvidas em acordo entre alunos e professores, com a palavra final do professor.
