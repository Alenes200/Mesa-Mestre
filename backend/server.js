const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const { createServer } = require('http');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const loginRepository = require('./repositories/loginRepository');
const loginRoutes = require('./routes/loginRoutes');
const produtosRoutes = require('./routes/produtoRoutes');
const userRoutes = require('./routes/userRoutes')
const path = require('path');

dotenv.config({ path: './.env' });

const port = process.env.PORT || 3000;
const app = express();

// Configuração do Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0', // Especifica a versão do OpenAPI
    info: {
      title: 'API do Projeto Mesa Mestre',
      version: '1.0.0',
      description: 'Documentação da API do Projeto Mesa Mestre',
      contact: {
        name: 'Sua Equipe',
      },
      servers: ['http://localhost:3000'], // URL base da sua API
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [path.join(__dirname, './routes/*.js')]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// Middlewares
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rotas
app.use('/api/auth', loginRoutes);
app.use('/api/produtos', produtosRoutes);
app.use('/api/users', userRoutes);

const server = createServer(app);

async function startServer() {
  try {
    await loginRepository.initializeTestUsers();

    server.listen(port, () => {
      console.log(`Servidor está rodando em http://localhost:${port}`);
      console.log(`Documentação Swagger disponível em http://localhost:${port}/api-docs`);
    });
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error);
  }
}

startServer();