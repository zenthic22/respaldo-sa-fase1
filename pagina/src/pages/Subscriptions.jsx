// Subscriptions.jsx
import React, { useEffect, useState } from "react";
import { Container, Card, Button, Row, Col, Alert, Modal, Form, Spinner } from "react-bootstrap";
import { useAuth } from "../Auth";
import subs from "../subsApi";
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from "@stripe/react-stripe-js";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: { fontSize: "16px", color: "#32325d", "::placeholder": { color: "#a0aec0" } },
    invalid: { color: "#e53e3e" }
  }
};

const Subscriptions = () => {
  const { user, login } = useAuth();
  const [subscriptions, setSubscriptions] = useState([]);
  const [message, setMessage] = useState("");
  const [showPay, setShowPay] = useState(false);
  const [zip, setZip] = useState("");
  const [brand, setBrand] = useState("");
  const [loadingPay, setLoadingPay] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  // Solo mensual para UI
  const PLAN_PRICES = { PREMIUM_MONTHLY: 9.99 };

  const fetchSubscriptions = async () => {
    try {
      const { data } = await subs.get(`/subscriptions/user/${user.id}`);
      setSubscriptions(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { fetchSubscriptions(); }, []);

  const activeSub = subscriptions.find((sub) => sub.status === "ACTIVE");

  const openPayModal = () => {
    setZip("");
    setBrand("");
    setShowPay(true);
    setMessage("");
  };

  const handleConfirmPay = async () => {
    if (!stripe || !elements) return;

    setLoadingPay(true);
    setMessage("");

    try {
      // 1) Crear PaymentMethod con tarjeta
      const cardElement = elements.getElement(CardNumberElement);
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.username,
          email: user.email,
          address: { postal_code: zip || undefined }
        }
      });
      if (error) {
        setMessage(error.message || "Error creando método de pago");
        setLoadingPay(false);
        return;
      }

      // 2) Crear/confirmar PaymentIntent (backend crea sub PENDING y la activará al aprobar)
      const idempotency_key = `intent-PREMIUM_MONTHLY-${user.id}-${Date.now()}`;
      const { data } = await subs.post("/payments/intent", {
        userId: user.id,
        plan_code: "PREMIUM_MONTHLY",
        payment_method_id: paymentMethod.id,
        idempotency_key
      });

      // 3) 3DS si se requiere
      if (data.requires_action && data.client_secret) {
        const { error: actionError, paymentIntent } = await stripe.confirmCardPayment(data.client_secret);
        if (actionError) {
          setMessage(actionError.message || "Autenticación 3DS fallida");
          setLoadingPay(false);
          return;
        }
        if (paymentIntent?.status !== "succeeded") {
          setMessage("El pago no se completó.");
          setLoadingPay(false);
          return;
        }
      } else if (data.status !== "succeeded") {
        setMessage(`Estado del pago: ${data.status}.`);
        setLoadingPay(false);
        return;
      }

      // 4) Éxito
      await fetchSubscriptions();
      login({
        accessToken: localStorage.getItem("accessToken"),
        refreshToken: localStorage.getItem("refreshToken"),
        user: { ...user, subscription_type: "PREMIUM" },
      });

      setMessage("¡Pago realizado con éxito! 🎉");
      setShowPay(false);
    } catch (err) {
      console.error(err);
      setMessage(err?.response?.data?.message || err.message || "Error al procesar el pago");
    } finally {
      setLoadingPay(false);
    }
  };

  const cancelSubscription = async (subscriptionId) => {
    try {
      await subs.put(`/subscriptions/${subscriptionId}/cancel`);
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

  return (
    <Container className="mt-4">
      <h2>Suscripciones</h2>
      {message && <Alert variant="info">{message}</Alert>}

      <Row>
        {/* Plan Premium Mensual */}
        <Col md={6}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Premium Mensual</Card.Title>
              <Card.Text>
                Acceso completo a todo el contenido por 1 mes <br />
                <strong>Precio: Q{PLAN_PRICES.PREMIUM_MONTHLY}</strong>
              </Card.Text>

              {/* Si ya está activo mensual, mostrar “Activo” y botón Cancelar */}
              {activeSub && activeSub.plan_code === "PREMIUM_MONTHLY" && activeSub.status === "ACTIVE" ? (
                <>
                  <Button variant="success" disabled>
                    Activo
                  </Button>
                  <Button
                    variant="danger"
                    className="ms-2"
                    onClick={() => cancelSubscription(activeSub.id)}
                  >
                    Cancelar suscripción
                  </Button>
                </>
              ) : (
                <Button variant="outline-success" onClick={openPayModal}>
                  Pagar
                </Button>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Plan Gratis (para volver a Free cancelando la actual) */}
        <Col md={6}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Gratis</Card.Title>
              <Card.Text>
                Acceso limitado a contenido gratuito <br />
                <strong>Precio: Q0</strong>
              </Card.Text>

              {user.subscription_type === "FREE" ? (
                <Button variant="secondary" disabled>Activo</Button>
              ) : (
                activeSub && (
                  <Button
                    variant="outline-secondary"
                    onClick={() => cancelSubscription(activeSub.id)}
                  >
                    Cambiar a Gratis (cancelar)
                  </Button>
                )
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal de pago */}
      <Modal show={showPay} onHide={() => setShowPay(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Pagar Premium Mensual</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Label>Número de tarjeta</Form.Label>
            <div className="border rounded p-2">
              <CardNumberElement
                options={CARD_ELEMENT_OPTIONS}
                onChange={(e) => setBrand(e.brand || "")}
              />
            </div>
            <small className="text-muted">Marca detectada: {brand || "—"}</small>

            <Row className="mt-3">
              <Col>
                <Form.Label>Vencimiento</Form.Label>
                <div className="border rounded p-2">
                  <CardExpiryElement options={CARD_ELEMENT_OPTIONS} />
                </div>
              </Col>
              <Col>
                <Form.Label>CVC</Form.Label>
                <div className="border rounded p-2">
                  <CardCvcElement options={CARD_ELEMENT_OPTIONS} />
                </div>
              </Col>
            </Row>

            <Form.Label className="mt-3">ZIP</Form.Label>
            <Form.Control
              placeholder="Código postal"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPay(false)} disabled={loadingPay}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleConfirmPay} disabled={loadingPay || !stripe || !elements}>
            {loadingPay ? <Spinner size="sm" animation="border" /> : "Confirmar pago"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Subscriptions;