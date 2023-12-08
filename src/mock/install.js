const bcrypt = require('bcrypt');

const MockUsers = [
    {
        username: "admin",
        email: "admin@email.com",
        password: bcrypt.hashSync("admin", 10),
        role: "admin"
    },
    {
        username: "User comum 1",
        email: "usercomum1@email.com",
        password: bcrypt.hashSync("usercomum1",10),
        role: "user"
    },
    {
        username: "User comum 2",
        email: "usercomum2@email.com",
        password: bcrypt.hashSync("usercomum2", 10),
        role: "user"
    },
    {
        username: "User comum 3",
        email: "usercomum3@email.com",
        password: bcrypt.hashSync("usercomum3", 10),
        role: "user"
    },
    {
        username: "User comum 4",
        email: "usercomum4@email.com",
        password: bcrypt.hashSync("usercomum4", 10),
        role: "user"
    }
];

const MockCategories = [
    {
        title: "Categoria 1",
    },
    {
        title: "Categoria 2",
    },
    {
        title: "Categoria 3",
    },
    {
        title: "Categoria 4",
    },
    {
        title: "Categoria 5",
    }
];

const MockComments = [
    {
        content: "Comentário 1",
    },
    {
        content: "Comentário 2",
    },
    {
        content: "Comentário 3",
    },
    {
        content: "Comentário 4",
    },
    {
        content: "Comentário 5",
    },
    {
        content: "Comentário 6",
    },
    {
        content: "Comentário 7",
    },
]

const MockPosts = [
    {
        title: "Post 1",
        content: "Conteúdo do post 1",
        categories: [],
        comments: [],
    },
    {
        title: "Post 2",
        content: "Conteúdo do post 2",
        categories: [],
        comments: [],
    },
    {
        title: "Post 3",
        content: "Conteúdo do post 3",
        categories: [],
        comments: [],
    },
    {
        title: "Post 4",
        content: "Conteúdo do post 4",
        categories: [],
        comments: [],
    },
    {
        title: "Post 5",
        content: "Conteúdo do post 5",
        categories: [],
        comments: [],
    },

]
module.exports = {
    MockUsers,
    MockCategories,
    MockComments,
    MockPosts
}