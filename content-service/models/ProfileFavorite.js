const db = require('../config/db');

class ProfileFavorite {
    constructor(id, profile_id, content) {
        this.id = id;
        this.profile_id = profile_id;
        this.content = content; // Aquí guardamos título, descripción, rating, géneros
    }

    // Obtener favoritos de un perfil con detalles del contenido y géneros
    static async getByProfile(profile_id) {
        const [rows] = await db.query(
            `
            SELECT 
                pf.id AS favorite_id,
                c.id AS content_id,
                c.title,
                c.description,
                c.rating,
                GROUP_CONCAT(g.name SEPARATOR ', ') AS genres
            FROM profile_favorites pf
            JOIN contents c ON pf.content_id = c.id
            LEFT JOIN content_genres cg ON c.id = cg.content_id
            LEFT JOIN genres g ON cg.genre_id = g.id
            WHERE pf.profile_id = ?
            GROUP BY pf.id, c.id, c.title, c.description, c.rating
            `,
            [profile_id]
        );

        return rows.map(r => new ProfileFavorite(r.favorite_id, profile_id, {
            id: r.content_id,
            title: r.title,
            description: r.description,
            rating: r.rating,
            genres: r.genres ? r.genres.split(', ') : []
        }));
    }

    // Agregar favorito
    static async add(profile_id, content_id) {
        const [result] = await db.query(
            "INSERT INTO profile_favorites (profile_id, content_id) VALUES (?, ?)",
            [profile_id, content_id]
        );
        return result.insertId;
    }

    // Eliminar favorito
    static async remove(profile_id, content_id) {
        const [result] = await db.query(
            "DELETE FROM profile_favorites WHERE profile_id = ? AND content_id = ?",
            [profile_id, content_id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = ProfileFavorite;