import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../Auth";

const AdminPanel = () => {
    const { user } = useAuth();

    return (
        <Container className="mt-4">
            <h2 className="mb-4">Bienvenido al panel de administracion, {user?.name}!</h2>
            <Row>
                <Col md={6} lg={4} className="mb-3">
                    <Card>
                        <Card.Body>
                            <Card.Title>Usuarios</Card.Title>
                            <Card.Text>
                                Crear, editar, eliminar usuarios y asignar roles.
                            </Card.Text>
                            <Button variant="primary">Gestionar usuarios</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} lg={4} className="mb-3">
                    <Card>
                        <Card.Body>
                            <Card.Title>Promociones</Card.Title>
                            <Card.Text>
                                Crear y administrar promociones y descuentos.
                            </Card.Text>
                            <Button variant="success">Gestionar promociones</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} lg={4} className="mb-3">
                    <Card>
                        <Card.Body>
                            <Card.Title>Reportes</Card.Title>
                            <Card.Text>
                                Revisar reportes de usuarios problematicos
                            </Card.Text>
                            <Button variant="danger">Ver reportes</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} lg={4} className="mb-3">
                    <Card>
                        <Card.Body>
                            <Card.Title>Contenido</Card.Title>
                            <Card.Text>
                                Subir, actualizar y eliminar videos, imagenes y archivos.
                            </Card.Text>
                            <Button as={Link} to="/admin/content" variant="dark">Configurar contenido</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} lg={4} className="mb-3">
                    <Card>
                        <Card.Body>
                            <Card.Title>Disponibilidad</Card.Title>
                            <Card.Text>Controlar fechas y suscripciones para contenido.</Card.Text>
                            <Button variant="info">Configurar disponibilidad</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default AdminPanel;