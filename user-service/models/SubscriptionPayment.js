const db = require('../config/db');

class SubscriptionPayment {
    constructor(id, subscription_id, amount, currency, provider, provider_ref, status, paid_at, failure_reason, promotion_id) {
        this.id = id;
        this.subscription_id = subscription_id;
        this.amount = amount;
        this.currency = currency;
        this.provider = provider;
        this.provider_ref = provider_ref;
        this.status = status;
        this.paid_at = paid_at;
        this.failure_reason = failure_reason;
        this.promotion_id = promotion_id;
    }

    static async create(subscription_id, amount, currency, provider, provider_ref, status, paid_at, failure_reason, promotion_id = null) {
        const [result] = await db.query(
            "INSERT INTO subscription_payments (subscription_id, amount, currency, provider, provider_ref, status, paid_at, failure_reason, promotion_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [subscription_id, amount, currency, provider, provider_ref, status, paid_at, failure_reason, promotion_id]
        );

        const [[sub]] = await db.query(
            "SELECT user_id FROM subscriptions WHERE id = ?",
            [subscription_id]
        );

        if (!sub) throw new Error("Suscripcion no encontrada");

        if (status === "APPROVED") {
            await db.query(
                "UPDATE users SET subscription_type = 'PREMIUM' WHERE id = ?",
                [sub.user_id]
            );
        }

        return result.insertId;
    }

    static async getBySubscription(subscription_id) {
        const [rows] = await db.query("SELECT * FROM subscription_payments WHERE subscription_id = ?", [subscription_id]);
        return rows.map(r => new SubscriptionPayment(...Object.values(r)));
    }
}

module.exports = SubscriptionPayment;