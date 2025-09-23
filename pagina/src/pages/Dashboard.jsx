import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../Auth";

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <Container>
            <h2 className="mt-4">Bienvenido, {user?.name}!</h2>
            <Row>
                <Col md={6} lg={4} className="mb-3">
                    <Card>
                        <Card.Body>
                            <Card.Title>Perfil</Card.Title>
                            <Card.Text>Edita tus datos, cambia avatar, correo o telefono</Card.Text>
                            <Button as={Link} to="/profile" variant="primary">Editar perfil</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} lg={4} className="mb-3">
                    <Card>
                        <Card.Body>
                            <Card.Title>Suscripción</Card.Title>
                            <Card.Text>Usa contenido gratuito o suscribirte al plan premium</Card.Text>
                            <Button as={Link} to="/subcriptions" variant="success">Gestionar suscripcion</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} lg={4} className="mb-3">
                    <Card>
                        <Card.Body>
                            <Card.Title>Perfiles</Card.Title>
                            <Card.Text>Crear y administra hasta 5 perfiles independientes</Card.Text>
                            <Button as={Link} to="/profiles" variant="warning">Administrar perfiles</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} lg={4} className="mb-3">
                    <Card>
                        <Card.Body>
                            <Card.Title>Favoritos</Card.Title>
                            <Card.Text>Agrega peliculas a favoritos o ver luego</Card.Text>
                            <Button as={Link} to="/favorites" variant="danger">Mis favoritos</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} lg={4} className="mb-3">
                    <Card.Body>
                        <Card.Title>Explorar</Card.Title>
                        <Card.Text>Recomendaciones, sinopsis e imagenes de peliculas</Card.Text>
                        <Button as={Link} to="/explore" variant="info">Explorar contenido</Button>
                    </Card.Body>
                </Col>
            </Row>
        </Container>
    )
}

export default Dashboard;