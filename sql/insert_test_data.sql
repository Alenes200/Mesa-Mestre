INSERT INTO TBL_MESA (MES_CAPACIDADE, MES_DESCRICAO, MES_LOCAL, MES_STATUS)
VALUES
    (5, 'Mesa 1', 'Área interna', 1),
    (5, 'Mesa 2', 'Área externa', 1),
    (5, 'Mesa 3', 'Área interna', 1),
	(5, 'Mesa 4', 'Área interna', -1),
    (5, 'Mesa 5', 'Área externa', 1),
    (5, 'Mesa 6', 'Área interna', 1),
	(4, 'Mesa 7', 'Área externa', 1),
    (6, 'Mesa 8', 'Área interna', 1),
    (2, 'Mesa 9', 'Área VIP', 1),
    (8, 'Mesa 10', 'Área interna', -1),
    (4, 'Mesa 11', 'Área externa', 1),
    (6, 'Mesa 12', 'Área VIP', 1);

INSERT INTO TBL_COMANDA (MES_ID, COM_STATUS)
VALUES
    (1, 1),  -- Mesa 1, comanda ativa
    (2, 1),  -- Mesa 2, comanda ativa
    (3, -1), -- Mesa 3, comanda encerrada
	(4, 1), -- Mesa 4, comanda ativa
    (5, -1), -- Mesa 5, comanda encerrada
    (6, 1), -- Mesa 6, comanda ativa
    (7, 1), -- Mesa 7, comanda ativa
    (8, -1); -- Mesa 8, comanda encerrada
	

INSERT INTO TBL_FORMA_PAGAMENTO (FPA_DESCRICAO)
VALUES
    ('Dinheiro'),
    ('Cartão de Crédito'),
    ('Cartão de Débito'),
    ('Pix');

INSERT INTO TBL_PRODUTO (PRO_NOME, PRO_DESCRICAO, PRO_LOCAL, PRO_PRECO, PRO_IMAGEM, PRO_TIPO, PRO_STATUS)
VALUES
    -- 🥗 Entradas
    ('Bruschetta', 'Pão italiano com tomate, manjericão e azeite', 'Cozinha', 18.00, 'bruschetta.jpg', 'Entrada', 1),
    ('Carpaccio', 'Fatias finas de carne com parmesão e rúcula', 'Cozinha', 28.00, 'carpaccio.jpg', 'Entrada', 1),
    ('Queijo Coalho', 'Espetinho de queijo coalho grelhado', 'Cozinha', 15.00, 'queijo_coalho.jpg', 'Entrada', 1),
    ('Ceviche', 'Peixe cru marinado no limão com pimenta', 'Cozinha', 32.00, 'ceviche.jpg', 'Entrada', 1),
    ('Tábua de Frios', 'Mix de queijos, presuntos e azeitonas', 'Cozinha', 45.00, 'tabua_frios.jpg', 'Entrada', 1),

    -- 🍕 Pratos Principais
    ('Risoto de Camarão', 'Risoto cremoso com camarões grelhados', 'Cozinha', 55.00, 'risoto_camarao.jpg', 'Prato Principal', 1),
    ('Parmegiana de Frango', 'Frango à milanesa com molho de tomate e queijo', 'Cozinha', 38.00, 'parmegiana.jpg', 'Prato Principal', 1),
    ('Salmão Grelhado', 'Filé de salmão grelhado com legumes', 'Cozinha', 62.00, 'salmao.jpg', 'Prato Principal', 1),
    ('Filé à Oswaldo Aranha', 'Filé com alho frito e batatas', 'Cozinha', 59.00, 'file_oswaldo.jpg', 'Prato Principal', 1),
    ('Feijoada Completa', 'Feijão preto com carnes, arroz e couve', 'Cozinha', 48.00, 'feijoada.jpg', 'Prato Principal', 1),
    ('Pizza de Calabresa', 'Massa fina com calabresa e cebola', 'Cozinha', 32.00, 'pizza_calabresa.jpg', 'Prato Principal', 1),
    ('Lasanha Bolonhesa', 'Massa recheada com carne moída e queijo', 'Cozinha', 40.00, 'lasanha.jpg', 'Prato Principal', 1),

    -- 🍟 Acompanhamentos
    ('Onion Rings', 'Anéis de cebola empanados e fritos', 'Cozinha', 16.00, 'onion_rings.jpg', 'Acompanhamento', 1),
    ('Purê de Batatas', 'Batata amassada cremosa', 'Cozinha', 12.00, 'pure.jpg', 'Acompanhamento', 1),
    ('Farofa Especial', 'Farofa com bacon e cebola', 'Cozinha', 10.00, 'farofa.jpg', 'Acompanhamento', 1),
    ('Arroz de Brócolis', 'Arroz branco misturado com brócolis', 'Cozinha', 14.00, 'arroz_brocolis.jpg', 'Acompanhamento', 1),

    -- 🍹 Bebidas
    ('Refrigerante Lata', 'Coca-Cola, Guaraná, Pepsi', 'Bar', 7.00, 'refrigerante.jpg', 'Bebida', 1),
    ('Suco de Morango', 'Suco natural de morango', 'Bar', 10.00, 'suco_morango.jpg', 'Bebida', 1),
    ('Caipirinha', 'Cachaça, limão e açúcar', 'Bar', 15.00, 'caipirinha.jpg', 'Bebida', 1),
    ('Cerveja Pilsen 600ml', 'Cerveja leve e refrescante', 'Bar', 12.00, 'cerveja_pilsen.jpg', 'Bebida', 1),
    ('Espresso', 'Café espresso forte e encorpado', 'Bar', 8.00, 'espresso.jpg', 'Bebida', 1),
    ('Vinho Tinto', 'Taça de vinho seco', 'Bar', 20.00, 'vinho_tinto.jpg', 'Bebida', 1),

    -- 🍰 Sobremesas
    ('Petit Gateau', 'Bolo quente com sorvete de baunilha', 'Cozinha', 22.00, 'petit_gateau.jpg', 'Sobremesa', 1),
    ('Pudim de Leite', 'Pudim tradicional com calda de caramelo', 'Cozinha', 14.00, 'pudim.jpg', 'Sobremesa', 1),
    ('Torta de Limão', 'Massa crocante com recheio cremoso', 'Cozinha', 16.00, 'torta_limao.jpg', 'Sobremesa', 1),
    ('Mousse de Maracujá', 'Mousse leve e aerado', 'Cozinha', 12.00, 'mousse_maracuja.jpg', 'Sobremesa', 1),
    ('Banoffee', 'Banana, doce de leite e chantilly', 'Cozinha', 18.00, 'banoffee.jpg', 'Sobremesa', 1);

INSERT INTO TBL_PEDIDO (COM_ID, PED_DESCRICAO, PED_STATUS, FPA_ID)
VALUES
    (1, 'Pedido de pizza e refrigerante', 1, 2),
    (2, 'Pedido de refrigerante', 1, 4),
    (3, 'Pedido de lasanha e vinho', 1, 3),
    (1, 'Pedido de risoto e cerveja', 1, 1),
    (2, 'Pedido de feijoada e suco', 1, 4),
    (3, 'Pedido de parmegiana e caipirinha', 1, 2),
    (1, 'Pedido de filé Oswaldo Aranha', 1, 3),
    (2, 'Pedido de bruschetta e espresso', 1, 2),
    (3, 'Pedido de mousse e chá', 1, 4),
    (1, 'Pedido de tábua de frios e vinho', 1, 1),
    (2, 'Pedido de salmão grelhado e suco', 1, 3),
    (3, 'Pedido de petit gateau e café', 1, 2),
    (1, 'Pedido de banoffee e chá', 1, 4),
    (2, 'Pedido de carpaccio e vinho', 1, 1),
    (3, 'Pedido de pudim e refrigerante', 1, 2),
    (1, 'Pedido de lasanha e refrigerante', 1, 3),
    (2, 'Pedido de pizza e suco', 1, 4),
    (3, 'Pedido de risoto e vinho', 1, 1),
    (1, 'Pedido de carne e farofa', 1, 2),
    (2, 'Pedido de peixe e purê', 1, 3);


INSERT INTO TBL_PEDIDO_PRODUTO (PED_ID, PRO_ID, PPR_QUANTIDADE)
VALUES
     -- Pedido 1: Pizza de Calabresa e Refrigerante
    (1, (SELECT PRO_ID FROM TBL_PRODUTO WHERE PRO_NOME = 'Pizza de Calabresa'), 1),
    (1, (SELECT PRO_ID FROM TBL_PRODUTO WHERE PRO_NOME = 'Refrigerante Lata'), 1),

    -- Pedido 2: Refrigerante
    (2, (SELECT PRO_ID FROM TBL_PRODUTO WHERE PRO_NOME = 'Refrigerante Lata'), 1),

    -- Pedido 3: Lasanha e Vinho
    (3, (SELECT PRO_ID FROM TBL_PRODUTO WHERE PRO_NOME = 'Lasanha Bolonhesa'), 1),
    (3, (SELECT PRO_ID FROM TBL_PRODUTO WHERE PRO_NOME = 'Vinho Tinto'), 1),

    -- Pedido 4: Risoto e Cerveja
    (4, (SELECT PRO_ID FROM TBL_PRODUTO WHERE PRO_NOME = 'Risoto de Camarão'), 1),
    (4, (SELECT PRO_ID FROM TBL_PRODUTO WHERE PRO_NOME = 'Cerveja Pilsen 600ml'), 1),

    -- Pedido 5: Feijoada e Suco
    (5, (SELECT PRO_ID FROM TBL_PRODUTO WHERE PRO_NOME = 'Feijoada Completa'), 1),
    (5, (SELECT PRO_ID FROM TBL_PRODUTO WHERE PRO_NOME = 'Suco de Morango'), 1),

    -- Pedido 6: Parmegiana e Caipirinha
    (6, (SELECT PRO_ID FROM TBL_PRODUTO WHERE PRO_NOME = 'Parmegiana de Frango'), 1),
    (6, (SELECT PRO_ID FROM TBL_PRODUTO WHERE PRO_NOME = 'Caipirinha'), 1),

    -- Pedido 7: Filé Oswaldo Aranha
    (7, (SELECT PRO_ID FROM TBL_PRODUTO WHERE PRO_NOME = 'Filé à Oswaldo Aranha'), 1),

    -- Pedido 8: Bruschetta e Espresso
    (8, (SELECT PRO_ID FROM TBL_PRODUTO WHERE PRO_NOME = 'Bruschetta'), 1),
    (8, (SELECT PRO_ID FROM TBL_PRODUTO WHERE PRO_NOME = 'Espresso'), 1),

    -- Pedido 9: Mousse e Chá (Chá não está na lista, então removi)
    (9, (SELECT PRO_ID FROM TBL_PRODUTO WHERE PRO_NOME = 'Mousse de Maracujá'), 1),

    -- Pedido 10: Tábua de Frios e Vinho
    (10, (SELECT PRO_ID FROM TBL_PRODUTO WHERE PRO_NOME = 'Tábua de Frios'), 1),
    (10, (SELECT PRO_ID FROM TBL_PRODUTO WHERE PRO_NOME = 'Vinho Tinto'), 1),

    -- Pedido 11: Salmão grelhado e Suco
    (11, (SELECT PRO_ID FROM TBL_PRODUTO WHERE PRO_NOME = 'Salmão Grelhado'), 1),
    (11, (SELECT PRO_ID FROM TBL_PRODUTO WHERE PRO_NOME = 'Suco de Morango'), 1),

    -- Pedido 12: Petit Gateau e Café
    (12, (SELECT PRO_ID FROM TBL_PRODUTO WHERE PRO_NOME = 'Petit Gateau'), 1),
    (12, (SELECT PRO_ID FROM TBL_PRODUTO WHERE PRO_NOME = 'Espresso'), 1),

    -- Pedido 13: Banoffee e Chá (Chá não está na lista, então removi)
    (13, (SELECT PRO_ID FROM TBL_PRODUTO WHERE PRO_NOME = 'Banoffee'), 1),

    -- Pedido 14: Carpaccio e Vinho
    (14, (SELECT PRO_ID FROM TBL_PRODUTO WHERE PRO_NOME = 'Carpaccio'), 1),
    (14, (SELECT PRO_ID FROM TBL_PRODUTO WHERE PRO_NOME = 'Vinho Tinto'), 1),

    -- Pedido 15: Pudim e Refrigerante
    (15, (SELECT PRO_ID FROM TBL_PRODUTO WHERE PRO_NOME = 'Pudim de Leite'), 1),
    (15, (SELECT PRO_ID FROM TBL_PRODUTO WHERE PRO_NOME = 'Refrigerante Lata'), 1),

    -- Pedido 16: Lasanha e Refrigerante
    (16, (SELECT PRO_ID FROM TBL_PRODUTO WHERE PRO_NOME = 'Lasanha Bolonhesa'), 1),
    (16, (SELECT PRO_ID FROM TBL_PRODUTO WHERE PRO_NOME = 'Refrigerante Lata'), 1),

    -- Pedido 17: Pizza e Suco
    (17, (SELECT PRO_ID FROM TBL_PRODUTO WHERE PRO_NOME = 'Pizza de Calabresa'), 1),
    (17, (SELECT PRO_ID FROM TBL_PRODUTO WHERE PRO_NOME = 'Suco de Morango'), 1),

    -- Pedido 18: Risoto e Vinho
    (18, (SELECT PRO_ID FROM TBL_PRODUTO WHERE PRO_NOME = 'Risoto de Camarão'), 1),
    (18, (SELECT PRO_ID FROM TBL_PRODUTO WHERE PRO_NOME = 'Vinho Tinto'), 1),

    -- Pedido 19: Carne e Farofa
    (19, (SELECT PRO_ID FROM TBL_PRODUTO WHERE PRO_NOME = 'Filé à Oswaldo Aranha'), 1),
    (19, (SELECT PRO_ID FROM TBL_PRODUTO WHERE PRO_NOME = 'Farofa Especial'), 1),

    -- Pedido 20: Peixe e Purê
    (20, (SELECT PRO_ID FROM TBL_PRODUTO WHERE PRO_NOME = 'Salmão Grelhado'), 1),
    (20, (SELECT PRO_ID FROM TBL_PRODUTO WHERE PRO_NOME = 'Purê de Batatas'), 1);