import React, { useEffect, useState } from "react";
import { Container, Card, Button, Row, Col, Alert } from "react-bootstrap";
import { useAuth } from "../Auth";
import axios from "axios";

const Subscriptions = () => {
  const { user, login } = useAuth();
  const [subscriptions, setSubscriptions] = useState([]);
  const [message, setMessage] = useState("");

  // precios fijos de los planes
  const PLAN_PRICES = {
    FREE: 0,
    PREMIUM_MONTHLY: 9.99,
    PREMIUM_ANNUAL: 99.99,
  };

  const fetchSubscriptions = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/subscriptions/user/${user.id}`
      );
      setSubscriptions(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleUpgrade = async (planCode) => {
    try {
      const activeSub = subscriptions.find((sub) => sub.status === "ACTIVE");
      let subscriptionId;

      if (activeSub) {
        // actualizar plan
        await axios.put(
          `http://localhost:3001/api/subscriptions/${activeSub.id}`,
          { plan_code: planCode }
        );
        subscriptionId = activeSub.id;
      } else {
        // crear nueva
        const response = await axios.post(
          `http://localhost:3001/api/subscriptions`,
          {
            user_id: user.id,
            plan_code: planCode,
            status: "ACTIVE",
          }
        );
        subscriptionId = response.data.id;
      }

      // generar pago solo si no es FREE
      if (planCode !== "FREE") {
        await axios.post(`http://localhost:3001/api/payments`, {
          subscription_id: subscriptionId,
          amount: PLAN_PRICES[planCode],
          currency: "Q",
          provider: "INTERNAL",
          provider_ref: `TXN-${Date.now()}`,
          status: "APPROVED",
          paid_at: new Date().toISOString().slice(0, 19).replace("T", " "),
          failure_reason: null,
          promotion_id: null,
        });
      }

      login({
        accessToken: localStorage.getItem("accessToken"),
        refreshToken: localStorage.getItem("refreshToken"),
        user: {
          ...user,
          subscription_type: planCode.includes("PREMIUM") ? "PREMIUM" : "FREE",
        },
      });

      setMessage(`Suscripción actualizada a ${planCode}`);
      fetchSubscriptions();
    } catch (error) {
      console.error("Error al actualizar/crear suscripción:", error);
      setMessage("Error al actualizar suscripción");
    }
  };

  const cancelSubscription = async (subscriptionId) => {
    try {
      await axios.put(
        `http://localhost:3001/api/subscriptions/${subscriptionId}/cancel`
      );

      login({
        accessToken: localStorage.getItem("accessToken"),
        refreshToken: localStorage.getItem("refreshToken"),
        user: { ...user, subscription_type: "FREE" },
      });

      setMessage("Tu suscripción fue cancelada.");
      fetchSubscriptions();
    } catch (error) {
      console.error("Error al cancelar la suscripción:", error);
      setMessage("Error al cancelar la suscripción.");
    }
  };

  const activeSub = subscriptions.find((sub) => sub.status === "ACTIVE");

  return (
    <Container className="mt-4">
      <h2>Suscripciones</h2>
      {message && <Alert variant="info">{message}</Alert>}
      <Row>
        {/* Plan Gratis */}
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Gratis</Card.Title>
              <Card.Text>
                Acceso limitado a contenido gratuito <br />
                <strong>Precio: Q{PLAN_PRICES.FREE}</strong>
              </Card.Text>
              <Button
                variant={
                  user.subscription_type === "FREE"
                    ? "secondary"
                    : "outline-secondary"
                }
                disabled={user.subscription_type === "FREE"}
                onClick={() => handleUpgrade("FREE")}
              >
                {user.subscription_type === "FREE" ? "Activo" : "Seleccionar"}
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Plan Premium Mensual */}
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Premium Mensual</Card.Title>
              <Card.Text>
                Acceso completo a todo el contenido por 1 mes <br />
                <strong>Precio: Q{PLAN_PRICES.PREMIUM_MONTHLY}</strong>
              </Card.Text>
              <Button
                variant={
                  subscriptions.some(
                    (s) =>
                      s.status === "ACTIVE" &&
                      s.plan_code === "PREMIUM_MONTHLY"
                  )
                    ? "success"
                    : "outline-success"
                }
                onClick={() => handleUpgrade("PREMIUM_MONTHLY")}
              >
                {subscriptions.some(
                  (s) =>
                    s.status === "ACTIVE" && s.plan_code === "PREMIUM_MONTHLY"
                )
                  ? "Activo"
                  : "Seleccionar"}
              </Button>

              {activeSub &&
                activeSub.plan_code === "PREMIUM_MONTHLY" &&
                activeSub.status === "ACTIVE" && (
                  <Button
                    variant="danger"
                    className="ms-2"
                    onClick={() => cancelSubscription(activeSub.id)}
                  >
                    Cancelar
                  </Button>
                )}
            </Card.Body>
          </Card>
        </Col>

        {/* Plan Premium Anual */}
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Premium Anual</Card.Title>
              <Card.Text>
                Acceso completo a todo el contenido por 1 año <br />
                <strong>Precio: Q{PLAN_PRICES.PREMIUM_ANNUAL}</strong>
              </Card.Text>
              <Button
                variant={
                  subscriptions.some(
                    (s) =>
                      s.status === "ACTIVE" &&
                      s.plan_code === "PREMIUM_ANNUAL"
                  )
                    ? "success"
                    : "outline-success"
                }
                onClick={() => handleUpgrade("PREMIUM_ANNUAL")}
              >
                {subscriptions.some(
                  (s) =>
                    s.status === "ACTIVE" && s.plan_code === "PREMIUM_ANNUAL"
                )
                  ? "Activo"
                  : "Seleccionar"}
              </Button>

              {activeSub &&
                activeSub.plan_code === "PREMIUM_ANNUAL" &&
                activeSub.status === "ACTIVE" && (
                  <Button
                    variant="danger"
                    className="ms-2"
                    onClick={() => cancelSubscription(activeSub.id)}
                  >
                    Cancelar
                  </Button>
                )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Subscriptions;