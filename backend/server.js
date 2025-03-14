const express = require('express');
const { createServer } = require('http');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const loginRoutes = require('./routes/loginRoutes');

dotenv.config({ path: './.env' });

const port = process.env.PORT || 3000;
const app = express();

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/auth', loginRoutes);

const server = createServer(app);

server.listen(port, () => {
    console.log(`Servidor está rodando em http://localhost:${port}`);
});