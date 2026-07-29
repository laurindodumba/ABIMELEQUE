CREATE TABLE cadastros (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefone VARCHAR(50),
    cidade VARCHAR(100),
    escolaridade VARCHAR(100),
    mensagem TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
