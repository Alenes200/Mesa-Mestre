const produtosRepository = require('../repositories/produtoRepository');
const path = require('path');
const fs = require('fs');
const { log } = require('console');

// Constantes para validação
const MAX_NOME = 255;
const MAX_DESCRICAO = 1000;
const MAX_LOCAL = 100;
const TIPOS_PERMITIDOS = ['comida', 'bebida', 'sobremesa', 'outro'];
const STATUS_PERMITIDOS = [0, 1]; // 0 = Inativo, 1 = Ativo

const produtosController = {
  list: async (req, res) => {
    try {
      const produtos = await produtosRepository.getAll();
      res.json(produtos);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar produtos.' });
    }
  },

  get: async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
      return res
        .status(400)
        .json({ error: 'ID inválido. Deve ser um número inteiro positivo.' });
    }
    try {
      const produto = await produtosRepository.getById(id);
      if (produto) {
        res.json(produto);
      } else {
        res.status(404).json({ error: 'Produto não encontrado.' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar produto.' });
    }
  },

  create: async (req, res) => {
    try {
      const { nome, descricao, local, tipo, preco } = req.body;

      // Validação básica de campos obrigatórios
      if (!nome || !descricao || !local || !tipo || !preco) {
        return res
          .status(400)
          .json({ error: 'Todos os campos são obrigatórios.' });
      }

      // Validação de arquivo de imagem
      if (!req.file) {
        return res.status(400).json({ error: 'Imagem é obrigatória.' });
      }

      // Validação de tipo de imagem
      const mimeTypesPermitidos = ['image/jpeg', 'image/png', 'image/gif'];
      if (!mimeTypesPermitidos.includes(req.file.mimetype)) {
        fs.unlinkSync(req.file.path); // Remove arquivo inválido
        return res
          .status(400)
          .json({ error: 'Tipo de imagem inválido. Use JPEG, PNG ou GIF.' });
      }

      // Validações de formato
      if (nome.length > MAX_NOME) {
        return res
          .status(400)
          .json({ error: `Nome não pode exceder ${MAX_NOME} caracteres.` });
      }

      if (!TIPOS_PERMITIDOS.includes(tipo)) {
        return res.status(400).json({ error: 'Tipo de produto inválido.' });
      }

      // Validação de preço
      const precoNumerico = Number(preco.replace(',', '.'));
      if (isNaN(precoNumerico) || precoNumerico <= 0) {
        return res
          .status(400)
          .json({ error: 'Preço deve ser um número positivo.' });
      }

      if (!/^\d+(\.\d{1,2})?$/.test(preco)) {
        return res
          .status(400)
          .json({ error: 'Preço deve ter até duas casas decimais.' });
      }

      // Verifica se nome já existe
      const produtoExistente = await produtosRepository.getByName(nome);
      if (produtoExistente) {
        return res
          .status(409)
          .json({ error: 'Já existe um produto com este nome.' });
      }

      // Caminho relativo da imagem
      const imagem = path.relative(
        path.join(__dirname, '..', 'uploads'),
        req.file.path
      );

      const novoProduto = await produtosRepository.create({
        nome: nome.trim(),
        descricao: descricao.trim(),
        local: local.trim(),
        tipo,
        preco: precoNumerico,
        imagem,
      });

      res.status(201).json(novoProduto);
    } catch (error) {
      if (req.file) fs.unlinkSync(req.file.path); // Limpa arquivo em caso de erro
      res.status(500).json({ error: 'Erro ao criar produto.' });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { nome, descricao, local, tipo, preco, status } = req.body;

      const produtoExistente = await produtosRepository.getByIdIgnoreStatus(id);
      if (!produtoExistente) {
        return res.status(404).json({ error: 'Produto não encontrado.' });
      }

      // Validação de status
      if (status !== undefined) {
        if (!STATUS_PERMITIDOS.includes(Number(status))) {
          return res.status(400).json({
            error: 'Status inválido. Use 0 para inativo ou 1 para ativo.',
          });
        }

        if (produtoExistente.status < 1 && status < 1) {
          return res.status(400).json({
            error: 'Produto desativado. Para reativar, defina status 1.',
          });
        }
      }

      // Validação de nome único se for alterado
      if (nome && nome !== produtoExistente.pro_nome) {
        const produtoComMesmoNome = await produtosRepository.getByName(nome);
        if (produtoComMesmoNome) {
          return res
            .status(409)
            .json({ error: 'Já existe um produto com este nome.' });
        }
      }

      // Validações de campos
      const validacoes = {
        nome: { valor: nome, max: MAX_NOME },
        descricao: { valor: descricao, max: MAX_DESCRICAO },
        local: { valor: local, max: MAX_LOCAL },
      };

      for (const [campo, { valor, max }] of Object.entries(validacoes)) {
        if (valor && valor.length > max) {
          return res
            .status(400)
            .json({ error: `${campo} não pode exceder ${max} caracteres.` });
        }
      }

      if (tipo && !TIPOS_PERMITIDOS.includes(tipo)) {
        return res.status(400).json({ error: 'Tipo de produto inválido.' });
      }

      // Validação de preço
      let precoNumerico;
      if (preco) {
        precoNumerico = Number(preco.replace(',', '.'));
        if (isNaN(precoNumerico) || precoNumerico <= 0) {
          return res
            .status(400)
            .json({ error: 'Preço deve ser um número positivo.' });
        }
        if (!/^\d+(\.\d{1,2})?$/.test(preco)) {
          return res
            .status(400)
            .json({ error: 'Preço deve ter até duas casas decimais.' });
        }
      }

      // Gerenciamento de imagem
      let imagem = produtoExistente.pro_imagem;
      if (req.file) {
        const novaImagem = path.relative(
          path.join(__dirname, '..', 'uploads'),
          req.file.path
        );

        if (imagem !== novaImagem) {
          // Remove imagem antiga se existir
          if (imagem) {
            const caminhoAntigo = path.join(__dirname, '..', 'uploads', imagem);
            if (fs.existsSync(caminhoAntigo)) fs.unlinkSync(caminhoAntigo);
          }
          imagem = novaImagem;
        } else {
          fs.unlinkSync(req.file.path); // Remove nova imagem redundante
        }
      }

      const produtoAtualizado = await produtosRepository.update(id, {
        nome: nome ? nome.trim() : produtoExistente.pro_nome,
        descricao: descricao
          ? descricao.trim()
          : produtoExistente.pro_descricao,
        local: local ? local.trim() : produtoExistente.pro_local,
        tipo: tipo || produtoExistente.pro_tipo,
        preco: precoNumerico || produtoExistente.pro_preco,
        imagem,
        status: status !== undefined ? status : produtoExistente.pro_status,
      });

      res.status(200).json(produtoAtualizado);
    } catch (error) {
      if (req.file) fs.unlinkSync(req.file.path); // Limpa arquivo em caso de erro
      res.status(500).json({ error: 'Erro ao atualizar produto.' });
    }
  },

  delete: async (req, res) => {
    try {
      const produtoAtualizado = await produtosRepository.delete(req.params.id);

      if (produtoAtualizado) {
        res.status(200).json({
          message: 'Produto desativado com sucesso.',
          produto: produtoAtualizado,
        });
      } else {
        res.status(404).json({ error: 'Produto não encontrado.' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Erro ao desativar produto.' });
    }
  },

  getByTipo: async (req, res) => {
    try {
      const { tipo } = req.params;

      const produtos = await produtosRepository.getByTipo(tipo);

      if (produtos.length > 0) {
        res.status(200).json(produtos);
      } else {
        res.status(404).json({
          error: 'Nenhum produto encontrado para o tipo especificado.',
        });
      }
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar produtos por tipo.' });
    }
  },
};

module.exports = produtosController;
