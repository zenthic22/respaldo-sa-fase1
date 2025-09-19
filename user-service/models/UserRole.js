const db = require('../config/db');

class UserRole {
    constructor(user_id, role_id, assigned_at) {
        this.user_id = user_id;
        this.role_id = role_id;
        this.assigned_at = assigned_at
    }

    // asignar un rol a un usuario
    static async assign(user_id, role_id) {
        const [result] = await db.query("INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)", [user_id, role_id]);
        return result.insertId;
    }

    // obtener todos los roles de un usuario
    static async getRoleByUser(user_id) {
        const [rows] = await db.query(
            `SELECT r.*
             FROM user_roles ur
             INNER JOIN roles r ON ur.role_id = r.id
             WHERE ur.user_id = ?`, [user_id]);
        return rows;
    }

    // obtener todos los usuarios con un rol especifico
    static async getUserByRole(role_id) {
        const [rows] = await db.query(
            `SELECT u.*
             FROM user_roles ur
             INNER JOIN users u ON ur.user_id = u.id
             WHERE ur.role_id = ?`, [role_id]);
        return rows;
    }

    // eliminar un rol asignado a un usuario
    static async remove(user_id, role_id) {
        const [result] = await db.query("DELETE FROM user_roles WHERE user_id = ? AND role_id = ?", [user_id, role_id]);
        return result.affectedRows > 0;
    }

    // eliminar todos los roles de un usuario
    static async removeAllByUser(user_id) {
        const [result] = await db.query("DELETE FROM user_roles WHERE user_id = ?", [user_id]);
        return result.affectedRows > 0;
    }
}

module.exports = UserRole;