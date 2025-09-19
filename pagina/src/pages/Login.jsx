import React, { useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../Auth";

const Login = () => {
    const [credentials, setCredentials] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const { data } = await api.post("/auth/login", credentials);

            login({
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
                user: {
                    id: data.user.id,
                    email: data.user.email,
                    name: data.user.name,
                    lastname: data.user.lastname,
                    role: data.user.role || "USER",
                }
            });

            if (data.user.role === "ADMIN") {
                navigate("/admin");
            } else {
                navigate("/dashboard");
            }

        } catch (error) {
            setError(error.response?.data?.message || "Credenciales incorrectas");
        }
    };

    return (
        <Container className="mt-5" style={{ maxWidth: "500px" }}>
            <h2 className="mb-4 text-center">Iniciar sesión</h2>
            
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Correo Electronico</Form.Label>
                    <Form.Control 
                        type="email"
                        name="email"
                        value={credentials.email}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control 
                        type="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                    Entrar
                </Button>
            </Form>
        </Container>
    )
}

export default Login;