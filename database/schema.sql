SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS controle_feedback
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE controle_feedback;

CREATE TABLE IF NOT EXISTS feedbacks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT NOT NULL,
  tipo ENUM('bug','sugestão','reclamação','feedback') NOT NULL,
  status ENUM('recebido','em análise','em desenvolvimento','finalizado') NOT NULL DEFAULT 'recebido'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
