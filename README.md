<h1 align="center">
  <img src="https://github.com/user-attachments/assets/facdaee6-5b39-434c-bccc-15262d4b516b" alt="logo 1" width="150"><br>
  Mesa Mestre
</h1>


**Mesa Mestre** é um sistema de gerenciamento para restaurantes, desenvolvido para simular um ambiente real de trabalho. Ele integra o controle de mesas, comandas, pedidos e um dashboard administrativo interativo, utilizando tecnologias modernas e boas práticas de desenvolvimento.

---

## Índice 🗂️

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Configuração e Instalação](#configuração-e-instalação)
- [Documentação da API](#documentação-da-api)
- [Imagens e Vídeos](#imagens-e-vídeos)
- [Contribuição](#contribuição)
- [Créditos](#creditos)
- [Licença](#licença)


---

## Sobre o Projeto ℹ️

O **Mesa Mestre** foi desenvolvido com o objetivo de oferecer uma solução completa para a gestão de restaurantes. Principais pontos do projeto:

- **Controle de Mesas:** Monitoramento do status (livre, ocupada ou aguardando) e disposição das mesas.
- **Gerenciamento de Comandas e Pedidos:** Criação, atualização e fechamento de comandas com suporte para divisão de contas.
- **Dashboard Administrativo:** Relatórios e gráficos interativos para análise de vendas, ocupação e desempenho dos produtos.
- **Segurança:** Autenticação via JWT, criptografia de senhas e níveis de acesso para diferentes perfis (administrador, atendente, cozinha e cliente).

---

## Funcionalidades 🚀

- **Gestão de Mesas**
  - Controle de status (disponível, ocupada, aguardando)
  - Organização por localização e capacidade

- **Sistema de Comandas e Pedidos**
  - Criação e gerenciamento de comandas
  - Adição e remoção de itens
  - Divisão de contas e suporte a diversos métodos de pagamento

- **Dashboard e Relatórios**
  - Visualização de gráficos (via Chart.js)
  - Indicadores de desempenho e análise financeira

- **Segurança**
  - Autenticação com JWT
  - Criptografia de senhas com Bcrypt
  - Diferentes níveis de acesso (Administrador, Atendente, Cozinha, Cliente)

- **Documentação e Suporte**
  - Documentação da API com Swagger
  - Padrões de código com ESLint e Prettier

---

## Tecnologias 💻

### Backend
- **Node.js** com Express
- **PostgreSQL** para o banco de dados (driver `pg`)
- **JWT** para autenticação
- **Bcrypt** para criptografia
- **Swagger** para documentação da API

### Frontend
- **HTML5**
- **SCSS/CSS3**
- **JavaScript ES6+**
- **Chart.js** para gráficos
- Uso de módulos ES6 para organização

### Ferramentas
- **ESLint** e **Prettier** para padronização do código
- Scripts SQL para criação, teste e manutenção do banco

---

## Estrutura do Projeto 🗃️

A organização do repositório segue a estrutura abaixo:
| ![Captura de Tela](https://github.com/user-attachments/assets/52c2f242-9d0a-479f-813e-ef8c8857d8cf) | .vscode/ - configurações específicas do Visual Studio Code<br><br>  |
|------------------------|----------------------------------------------------------------------------------------|


---

## Configuração e Instalação ⚙️

### Pré-requisitos

- Node.js (v12 ou superior)
- PostgreSQL

### Passo a Passo

1. **Clone o Repositório:**

   ```bash
   git clone https://github.com/Alenes200/Mesa-Mestre.git
   cd Mesa-Mestre
   
2. **Instalar Dependências:**

   ```bash
   npm install
   
3. **Configurar Variáveis de Ambiente:**
    - Crie um arquivo .env na raiz do projeto com as seguintes variáveis:
   ```bash
   DB_HOST=localhost
   DB_USER=seu_usuario
   DB_PASS=sua_senha
   DB_NAME=mesa_mestre
   JWT_SECRET="coloque sua senha"
   PORT=3000
   
   SENHA_SECRETA_1="coloque sua senha"
   SENHA_SECRETA_2="coloque sua senha"
   SENHA_SECRETA_3="coloque sua senha"
   SENHA_SECRETA_4="coloque sua senha"

4. **Configurando o arquivo createTestUsers.js na pasta Utils:**
    - Este arquivo vai criar os 4 tipos de usuários que precisamos para gerenciar nosso sistema.
    - Escolha o nome e e-mail para cada tipo usuário.

   ```bash
   // Cria um usuário Administrador (user_type = 1)
    await createTestUser(
      client,
      'Nome do Adm',
      '@example.com',
      process.env.SENHA_SECRETA_1,
      1
    );

    // Cria um usuário funcionário (user_type = 2)
    await createTestUser(
      client,
      'Nome do funcionário',
      '@example.com',
      process.env.SENHA_SECRETA_2,
      2
    );

    // Cria um usuário comum (user_type = 3)
    await createTestUser(
      client,
      'Usuário Comum',
      '@example.com',
      process.env.SENHA_SECRETA_3,
      3
    );
    // Cria um usuário auxilar de cozinha (user_type = 4)
    await createTestUser(
      client,
      'Nome do auxiliar de cozinha',
      '@example.com',
      process.env.SENHA_SECRETA_4,
      4
    );
   
4. **Configurar o Banco de Dados:**

    Executar Scripts SQL: Na pasta sql, você encontrará scripts para criação das tabelas e inserção de dados iniciais. Execute-os no seu banco de dados PostgreSQL.
    - O arquivo create_tables.sql tem as tabelas necessárias, funções e tiggers para rodar corretamente o proejto.
    - O arquivo insert_test_data.sql está os insert no banco necessários. 
    
5. **Iniciar o Servidor Backend:**

   ```bash
   npm start
   
---

 ## Documentação da API 🧾
 A API está documentada utilizando o Swagger. Após iniciar o servidor, você pode acessar a documentação navegando até:
     
    http://localhost:3000/api-docs

   
Essa interface fornece todos os endpoints, parâmetros e exemplos de requisições/respostas.

---

 ## Imagens e Vídeo Explicativo 🎥
 
 ### Funcionamento do nosso projeto em partes 
 #### Página Principal
 
 #### Página do cardápio personalizado para seu restaurante
 
 #### Página do funcionário mobile
 
 #### Página da cozinha
 
 #### Página do administrador

---

## Contribuição 🤝
 Contribuições são bem-vindas! Siga os passos abaixo para contribuir com o Mesa Mestre:

1. Faça um fork do repositório.

2. Crie uma branch para a sua feature:
    ```
    git checkout -b minha-nova-feature.

3. Commit suas alterações: 
    ```
    git commit -m 'Adiciona nova feature'.

4. Faça o push para a branch: 
    ```
    git push origin minha-nova-feature.

5. Abra um Pull Request.
 
##### Certifique-se de seguir os padrões de código (ESLint/Prettier) e incluir testes quando aplicável.
---

## Créditos 🙌

<a href="https://github.com/Alenes200" target="_blank">Alexsander Nunes</a><br>
<a href="https://github.com/luizricardomaciel" target="_blank">Luiz Ricardo</a><br>
<a href="https://github.com/Duduvsky" target="_blank">Matheus Eduardo</a><br>
<a href="https://github.com/Nicolassouza92" target="_blank">Nicolas de Souza</a><br>
<a href="https://github.com/SamuelMori" target="_blank">Samuel Mori</a>

---

## Licença 📄
Distribuído sob a licença MIT. Consulte o arquivo LICENSE para mais detalhes.
