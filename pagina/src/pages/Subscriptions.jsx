import React, { useEffect, useState } from "react";
import { Container, Card, Button, Row, Col, Alert } from "react-bootstrap";
import { useAuth } from "../Auth";
import axios from "axios"

const Subscriptions = () => {
    const { user, login } = useAuth();
    const [subcriptions, setSubscriptions] = useState([]);
    const [message, setMessage] = useState("");

    const fetchSubscriptions = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/subscriptions/user/${user.id}`);
            setSubscriptions(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchSubscriptions()
    }, []);

    const handleUpgrade = async (plan) => {
        try {
            const activeSub = subcriptions.find(sub => sub.status === "ACTIVE") || {};
            if (activeSub.id) {
                await axios.put(`http://localhost:3001/api/subscriptions/${activeSub}`, { plan_code: plan, status: "ACTIVE" });
            }
            const updatedUser = { ...user, subcription_type: plan };
            login({
                accessToken: localStorage.getItem("accessToken"),
                refreshToken: localStorage.getItem("refreshToken"),
                user: updatedUser
            });

            setMessage(`Suscripcion actualizada a ${plan}`);
            fetchSubscriptions();
        } catch (error) {
            console.error(error);
            setMessage("Error al actualizar suscripcion");
        }
    };

    return (
        <Container className="mt-4">
            <h2>Suscripciones</h2>
            {message && <Alert variant="info">{message}</Alert>}
            <Row>
                <Col md={4}>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Gratis</Card.Title>
                            <Card.Text>Acceso limitado a contenido gratuito</Card.Text>
                            <Button
                                variant={user.subscription_type === "FREE" ? "secondary" : "outline-secondary"}
                                disabled={user.subscription_type === "FREE"}
                                onClick={() => handleUpgrade("FREE")}
                            >
                                {user.subscription_type === "FREE" ? "Activo" : "Seleccionar"}
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Premium</Card.Title>
                            <Card.Text>Acceso completo a todo el contenido</Card.Text>
                            <Button
                                variant={user.subscription_type === "PREMIUM" ? "success" : "outline-success"}
                                disabled={user.subscription_type === "PREMIUM"}
                                onClick={() => handleUpgrade("PREMIUM")}
                            >
                                {user.subscription_type === "PREMIUM" ? "Activo" : "Actualizar"}
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Subscriptions;