import React, { useEffect, useState } from "react";
import { Form, Button, Container, Alert, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../api";

const Register = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        department: "",
        city: "",
        address: "",
        birthdate: "",
        sex: "",
        avatar_url: null,
        subscription_type: "FREE",
        role: "USER",
    });

    const [roles, setRoles] = useState([])
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const res = await api.get("/roles");
                setRoles(res.data);
            } catch (error) {
                console.error("Error al cargar roles: ", error);
            }
        };
        fetchRoles();
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            await api.post("/auth/register", formData);
            setSuccess("Usuario registrado con exito!!");
            setTimeout(() => navigate("/"), 2000);
        } catch (error) {
            setError(error.response?.data?.message || "Error al registrar usuario");
        }
    };

    return (
        <Container className="mt-5" style={{ maxWidth: "700px" }}>
            <h2 className="mb-4 text-center">Crear cuenta</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre de usuario</Form.Label>
                            <Form.Control type="text" name="username" value={formData.username} onChange={handleChange} required />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombres</Form.Label>
                            <Form.Control type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Label>Apellidos</Form.Label>
                        <Form.Control type="text" name="last_name" value={formData.last_name} onChange={handleChange} required />
                    </Col>
                </Row>
                <Form.Group className="mb-3">
                <Form.Label>Correo electrónico</Form.Label>
                <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                </Form.Group>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                        <Form.Label>Teléfono</Form.Label>
                        <Form.Control
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                        <Form.Label>Sexo</Form.Label>
                        <Form.Select
                            name="sex"
                            value={formData.sex}
                            onChange={handleChange}
                        >
                            <option value="">Seleccione...</option>
                            <option value="M">Masculino</option>
                            <option value="F">Femenino</option>
                        </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label>Departamento</Form.Label>
                            <Form.Control
                                type="text"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>

                    <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label>Ciudad</Form.Label>
                            <Form.Control
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>

                    <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label>Dirección</Form.Label>
                            <Form.Control
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Form.Group className="mb-3">
                    <Form.Label>Fecha de nacimiento</Form.Label>
                    <Form.Control
                        type="date"
                        name="birthdate"
                        value={formData.birthdate}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                <Form.Label>Rol</Form.Label>
                    <Form.Select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Seleccione...</option>
                        {roles.map((r) => (
                        <option key={r.id} value={r.name}>
                            {r.name}
                        </option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100">
                    Registrarse
                </Button>
            </Form>
        </Container>
    )
}

export default Register;