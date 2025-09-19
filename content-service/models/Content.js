const db = require('../config/db');

class Content {
    constructor(id, title, description, release_date, type, rating, duration, created_at, updated_at, genres = []) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.release_date = release_date;
        this.type = type;
        this.rating = rating;
        this.duration = duration;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.genres = genres; // arreglo de géneros
    }

    // Obtener todos los contenidos con géneros
    static async getAll() {
        const [rows] = await db.query("SELECT * FROM contents");

        const contents = [];
        for (let row of rows) {
            const [genres] = await db.query(
                `SELECT g.id, g.name 
                 FROM genres g 
                 INNER JOIN content_genres cg ON g.id = cg.genre_id 
                 WHERE cg.content_id = ?`,
                [row.id]
            );

            contents.push(new Content(
                row.id,
                row.title,
                row.description,
                row.release_date,
                row.type,
                row.rating,
                row.duration,
                row.created_at,
                row.updated_at,
                genres
            ));
        }

        return contents;
    }

    // Crear contenido con géneros
    static async create(data) {
        const [result] = await db.query(
            `INSERT INTO contents (title, description, release_date, type, rating, duration)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [data.title, data.description, data.release_date, data.type, data.rating || null, data.duration || null]
        );

        const contentId = result.insertId;

        // Guardar géneros si vienen en el request
        if (data.genres && data.genres.length > 0) {
            for (let genreId of data.genres) {
                await db.query(
                    "INSERT INTO content_genres (content_id, genre_id) VALUES (?, ?)",
                    [contentId, genreId]
                );
            }
        }

        return contentId;
    }

    // Buscar contenido por id (con géneros)
    static async getById(id) {
        const [rows] = await db.query("SELECT * FROM contents WHERE id = ?", [id]);
        if (rows.length === 0) return null;
        const row = rows[0];

        const [genres] = await db.query(
            `SELECT g.id, g.name 
             FROM genres g 
             INNER JOIN content_genres cg ON g.id = cg.genre_id 
             WHERE cg.content_id = ?`,
            [id]
        );

        return new Content(
            row.id,
            row.title,
            row.description,
            row.release_date,
            row.type,
            row.rating,
            row.duration,
            row.created_at,
            row.updated_at,
            genres
        );
    }

    // Actualizar contenido (y sus géneros)
    static async update(id, data) {
        const [result] = await db.query(
            `UPDATE contents
             SET title=?, description=?, release_date=?, type=?, rating=?, duration=?, updated_at=NOW()
             WHERE id=?`,
            [data.title, data.description, data.release_date, data.type, data.rating, data.duration, id]
        );

        if (data.genres) {
            // Primero limpiamos géneros actuales
            await db.query("DELETE FROM content_genres WHERE content_id = ?", [id]);
            // Insertamos los nuevos
            for (let genreId of data.genres) {
                await db.query(
                    "INSERT INTO content_genres (content_id, genre_id) VALUES (?, ?)",
                    [id, genreId]
                );
            }
        }

        return result.affectedRows > 0;
    }

    // Eliminar contenido
    static async delete(id) {
        const [result] = await db.query("DELETE FROM contents WHERE id = ?", [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Content;