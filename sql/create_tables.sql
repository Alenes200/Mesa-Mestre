CREATE TABLE TBL_LOCAL (
	LOC_ID BIGSERIAL PRIMARY KEY,
	LOC_DESCRICAO VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE TBL_MESA (
	MES_ID BIGSERIAL PRIMARY KEY,
	-- MES_NOME VARCHAR(255) NOT NULL,
	-- MES_CODIGO VARCHAR(255) NOT NULL,
	MES_CAPACIDADE INTEGER NOT NULL,
	MES_DESCRICAO TEXT,
	LOC_ID BIGINT REFERENCES TBL_LOCAL(LOC_ID) ON DELETE SET NULL,
	MES_STATUS INTEGER DEFAULT 1 CHECK (MES_STATUS IN (2, 1, -1))
);

CREATE TABLE TBL_COMANDA (
	COM_ID BIGSERIAL PRIMARY KEY,
	MES_ID BIGINT REFERENCES TBL_MESA(MES_ID) ON DELETE SET NULL,
	COM_DATA_INICIO TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	COM_DATA_FIM TIMESTAMP,
	COM_STATUS INTEGER DEFAULT 1 CHECK (COM_STATUS IN (1, -1))
);

CREATE TABLE TBL_FORMA_PAGAMENTO (
	FPA_ID BIGSERIAL PRIMARY KEY,
	FPA_DESCRICAO VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE TBL_PEDIDO (
	PED_ID BIGSERIAL PRIMARY KEY,
	COM_ID BIGINT REFERENCES TBL_COMANDA(COM_ID) ON DELETE SET NULL,
	PED_DESCRICAO VARCHAR(255),
	PED_STATUS INTEGER DEFAULT 1 CHECK (PED_STATUS IN (1, -1)),
	PED_PRECO_TOTAL DECIMAL(10,2) DEFAULT 0.00,
	FPA_ID BIGINT REFERENCES TBL_FORMA_PAGAMENTO(FPA_ID) ON DELETE SET NULL,
	PED_CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	PED_UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE TBL_PRODUTO (
	PRO_ID BIGSERIAL PRIMARY KEY,
	PRO_NOME VARCHAR(255) NOT NULL,
	PRO_DESCRICAO TEXT NOT NULL,
	PRO_LOCAL VARCHAR(255),
	PRO_PRECO DECIMAL(10,2) NOT NULL,
	PRO_IMAGEM VARCHAR(255) NOT NULL,
    PRO_TIPO VARCHAR(255) NOT NULL,
	PRO_STATUS INTEGER DEFAULT 1 CHECK (PRO_STATUS IN (1, -1)),
	PRO_CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	PRO_UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE TBL_PEDIDO_PRODUTO (
	PPR_ID BIGSERIAL PRIMARY KEY,
	PED_ID BIGINT NOT NULL REFERENCES TBL_PEDIDO(PED_ID) ON DELETE SET NULL,
	PRO_ID BIGINT NOT NULL REFERENCES TBL_PRODUTO(PRO_ID) ON DELETE SET NULL,
	PPR_QUANTIDADE INTEGER NOT NULL CHECK (PPR_QUANTIDADE > 0)
);

CREATE TABLE TBL_USERS (
	USR_ID BIGSERIAL PRIMARY KEY,
	USR_NOME VARCHAR(255) NOT NULL,
	USR_EMAIL VARCHAR(255) UNIQUE NOT NULL,
	USR_SENHA VARCHAR(255) NOT NULL,
	USR_TELEFONE VARCHAR(20),
	USR_FUNCAO VARCHAR(255),
	USR_TIPO INTEGER NOT NULL DEFAULT 3 CHECK (USR_TIPO IN (1, 2, 3)),
	USR_STATUS INTEGER NOT NULL DEFAULT 1,
	USR_CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	USR_UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION atualizar_ped_updated_at() RETURNS TRIGGER AS $$
BEGIN
    IF TG_TABLE_NAME = 'tbl_users' THEN
        NEW.usr_updated_at := CURRENT_TIMESTAMP;
    ELSIF TG_TABLE_NAME = 'tbl_pedido' THEN
        NEW.ped_updated_at := CURRENT_TIMESTAMP;
    ELSIF TG_TABLE_NAME = 'tbl_produto' THEN
        NEW.pro_updated_at := CURRENT_TIMESTAMP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_atualizar_usr_updated_at
BEFORE UPDATE ON tbl_users
FOR EACH ROW EXECUTE FUNCTION atualizar_ped_updated_at();

CREATE OR REPLACE TRIGGER trigger_atualizar_ped_updated_at
BEFORE UPDATE ON tbl_pedido
FOR EACH ROW EXECUTE FUNCTION atualizar_ped_updated_at();

CREATE OR REPLACE TRIGGER trigger_atualizar_pro_updated_at
BEFORE UPDATE ON tbl_produto
FOR EACH ROW EXECUTE FUNCTION atualizar_ped_updated_at();