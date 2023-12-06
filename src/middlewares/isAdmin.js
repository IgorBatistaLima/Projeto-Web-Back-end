const jwt = require('jsonwebtoken');
const { User } = require('../models/User');
require('dotenv').config();



const isAdmin = async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    try {
        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(404).send({ error: 'Usuário não encontrado!' });
        }
        req.user = user;
    } catch (error) {
        return res.status(500).send({ error: 'Erro interno do servidor' });
    }

    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: 'usuario não e admin' });
    }
};

module.exports = isAdmin;