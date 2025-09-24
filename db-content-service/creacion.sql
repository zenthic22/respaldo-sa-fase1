CREATE DATABASE IF NOT EXISTS content_db
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_0900_ai_ci;
USE content_db;

CREATE TABLE genres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE contents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    release_date DATE,
    type ENUM('MOVIE', 'SERIES') NOT NULL,
    rating DECIMAL(3,1),
    duration INT, -- en minutos (solo aplica a películas)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE content_genres (
    content_id INT NOT NULL,
    genre_id INT NOT NULL,
    PRIMARY KEY (content_id, genre_id),
    FOREIGN KEY (content_id) REFERENCES contents(id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
);

CREATE TABLE availability_windows (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    FOREIGN KEY (content_id) REFERENCES contents(id) ON DELETE CASCADE
);

CREATE TABLE media_assets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content_id INT NOT NULL,
    type ENUM('POSTER', 'BACKDROP', 'THUMBNAIL') NOT NULL,
    url VARCHAR(500) NOT NULL,
    FOREIGN KEY (content_id) REFERENCES contents(id) ON DELETE CASCADE
);

CREATE TABLE plan_visibility (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content_id INT NOT NULL,
    plan ENUM('FREE', 'STANDARD', 'PREMIUM') NOT NULL,
    FOREIGN KEY (content_id) REFERENCES contents(id) ON DELETE CASCADE
);

CREATE TABLE profile_recent_views (
    id INT AUTO_INCREMENT PRIMARY KEY,
    profile_id INT NOT NULL,
    content_id INT NOT NULL,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (content_id) REFERENCES contents(id) ON DELETE CASCADE
);

CREATE TABLE profile_watch_again (
    id INT AUTO_INCREMENT PRIMARY KEY,
    profile_id INT NOT NULL,
    content_id INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (content_id) REFERENCES contents(id) ON DELETE CASCADE
);

CREATE TABLE profile_favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    profile_id INT NOT NULL,
    content_id INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (content_id) REFERENCES contents(id) ON DELETE CASCADE
);

CREATE TABLE profile_watch_later (
    id INT AUTO_INCREMENT PRIMARY KEY,
    profile_id INT NOT NULL,
    content_id INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (content_id) REFERENCES contents(id) ON DELETE CASCADE
);