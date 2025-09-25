CREATE DATABASE IF NOT EXISTS user_db
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_0900_ai_ci;
USE user_db;

-- ========================
-- TABLAS INDEPENDIENTES
-- ========================

-- Roles del sistema
CREATE TABLE roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Sistema de promociones
CREATE TABLE promotions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  type ENUM('PERCENT','FIXED') NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  start_at DATETIME NOT NULL,
  end_at DATETIME NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (end_at > start_at)
) ENGINE=InnoDB;

-- ========================
-- TABLAS PRINCIPALES
-- ========================

-- Usuarios (con perfil activo opcional)
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(80),
  last_name VARCHAR(80),
  email VARCHAR(150) NOT NULL,
  email_norm VARCHAR(150) AS (LOWER(email)) STORED,
  phone VARCHAR(30),
  department VARCHAR(100),
  city VARCHAR(100),
  address TEXT,
  birthdate DATE,
  sex ENUM('M','F','X'),
  avatar_url VARCHAR(500),
  subscription_type ENUM('FREE','PREMIUM') NOT NULL DEFAULT 'FREE',
  is_blocked BOOLEAN NOT NULL DEFAULT FALSE,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_users_email_norm (email_norm),
  UNIQUE KEY uq_users_username (username)
) ENGINE=InnoDB;

-- Perfiles de usuario
CREATE TABLE profiles (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  name VARCHAR(80) NOT NULL,
  avatar_url VARCHAR(500),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  KEY idx_profiles_user (user_id)
) ENGINE=InnoDB;

-- ========================
-- TABLAS RELACIONADAS
-- ========================

-- Asignación de roles a usuarios
CREATE TABLE user_roles (
  user_id BIGINT,
  role_id INT,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Afinidades de usuario
CREATE TABLE user_affinities (
  user_id BIGINT NOT NULL,
  category_code VARCHAR(80) NOT NULL,
  added_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, category_code),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Suscripciones
CREATE TABLE subscriptions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  plan_code VARCHAR(40) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NULL,
  status ENUM('PENDING','ACTIVE','CANCELLED','EXPIRED') NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  KEY idx_sub_user_status (user_id, status)
) ENGINE=InnoDB;

-- Pagos de suscripciones
CREATE TABLE subscription_payments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  subscription_id BIGINT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(8) NOT NULL DEFAULT 'GTQ',
  provider VARCHAR(32) NOT NULL,
  provider_ref VARCHAR(128),
  status ENUM('APPROVED','FAILED') NOT NULL,
  paid_at DATETIME NULL,
  failure_reason TEXT,
  promotion_id BIGINT NULL,
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE,
  FOREIGN KEY (promotion_id) REFERENCES promotions(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Promociones asignadas a usuarios
CREATE TABLE promotion_assignments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  promotion_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  scope ENUM('GLOBAL','ACCOUNT') NOT NULL DEFAULT 'ACCOUNT',
  assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (promotion_id) REFERENCES promotions(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Reportes de usuarios
CREATE TABLE user_reports (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  reason VARCHAR(120) NOT NULL,
  detail TEXT,
  status ENUM('OPEN','IN_REVIEW','RESOLVED','BLOCKED') NOT NULL DEFAULT 'OPEN',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  KEY idx_reports_status (status)
) ENGINE=InnoDB;

-- Acciones sobre reportes
CREATE TABLE report_actions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  report_id BIGINT NOT NULL,
  admin_ref BIGINT NULL,
  action ENUM('NOTE','BLOCK','UNBLOCK','DISCOUNT') NOT NULL,
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (report_id) REFERENCES user_reports(id) ON DELETE CASCADE
) ENGINE=InnoDB;

