
const User = require('../models/User'); // Substitua '../models/User' pelo caminho correto para o arquivo User.js

const UserController = {
    // Criar um usuário
    createUser: async (req, res) => {
        const { username, password, email, isAdmin, role } = req.body;

        try {
            const user = await User.create({ username, password, email, isAdmin, role });
            return res.send({ user });
        } catch (err) {
            return res.status(400).send({ error: 'Falha ao registrar o usuário' });
        }
    },

    // Buscar um usuário
    getUser: async (req, res) => {
        const { username } = req.params;

        try {
            const user = await User.findOne({ username });
            if (user) {
                return res.send({ user });
            } else {
                return res.status(404).send({ error: 'Usuário não encontrado' });
            }
        } catch (err) {
            return res.status(500).send({ error: 'Erro ao buscar o usuário' });
        }
    },

    // Atualizar um usuário
    updateUser: async (req, res) => {
        const { username } = req.params;
        const { password, email, isAdmin, role } = req.body;

        try {
            const user = await User.findOneAndUpdate({ username }, { password, email, isAdmin, role }, { new: true });
            if (user) {
                return res.send({ user });
            } else {
                return res.status(404).send({ error: 'Usuário não encontrado' });
            }
        } catch (err) {
            return res.status(500).send({ error: 'Erro ao atualizar o usuário' });
        }
    },

    // Deletar um usuário
    deleteUser: async (req, res) => {
        const { username } = req.params;

        try {
            const user = await User.findOneAndDelete({ username });
            if (user) {
                return res.send({ success: 'Usuário deletado com sucesso' });
            } else {
                return res.status(404).send({ error: 'Usuário não encontrado' });
            }
        } catch (err) {
            return res.status(500).send({ error: 'Erro ao deletar o usuário' });
        }
    }
};

module.exports = UserController;
