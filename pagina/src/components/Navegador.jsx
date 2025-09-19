import React from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Auth";

const NavigationBar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    }

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    Chapinflix
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/contents">Contenido</Nav.Link>
                        <Nav.Link as={Link} to="/genres">Generos</Nav.Link>
                    </Nav>
                    <Nav>
                        {user ? (
                            <NavDropdown title={`${user.name} ${user.lastname}`} id="user-nav-dropdown">
                                {user.role == "ADMIN" && (
                                    <NavDropdown.Item as={Link} to="/admin">Panel admin</NavDropdown.Item>
                                )}
                                <NavDropdown.Item as={Link} to="/profile">Perfil</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={handleLogout}>Cerrar sesion</NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login">Iniciar sesion</Nav.Link>
                                <Nav.Link as={Link} to="/register">Registrarse</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavigationBar;