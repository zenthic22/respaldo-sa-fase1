import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert, Row, Col, Image } from "react-bootstrap";
import { useAuth } from "../Auth";
import userApi from "../userApi";

const Profile = () => {
    const { user, login } = useAuth();
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        avatar_url: ""
    });
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.name || "",
                last_name: user.lastname || "",
                email: user.email || "",
                phone: user.phone || "",
                avatar_url: user.avatar_url || ""
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const { email, ...dataToSend } = formData;

            await userApi.put(`/users/${user.id}`, dataToSend);

            login({
                accessToken: localStorage.getItem("accessToken"),
                refreshToken: localStorage.getItem("refreshToken"),
                user: {
                    ...user,
                    name: formData.first_name,
                    lastname: formData.last_name,
                    phone: formData.phone,
                    avatar_url: formData.avatar_url
                }
            });

            setSuccess("Perfil actualizado correctamente!");

        } catch (error) {
            setError(error.response?.data?.message || "Error al actualizar perfil");
        }
    };

    return (
        <Container style={{ maxWidth: "600px" }} className="mt-4">
            <h2>Editar Perfil</h2>
            { success && <Alert variant="success">{ success }</Alert> }
            { error && <Alert variant="danger">{ error }</Alert> }

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Correo</Form.Label>
                    <Form.Control type="email" value={formData.email} readOnly/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control 
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Apellido</Form.Label>
                    <Form.Control 
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Teléfono</Form.Label>
                    <Form.Control
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Avatar</Form.Label>
                    <div className="mb-2">
                        {formData.avatar_url ? (
                            <Image 
                                src={formData.avatar_url}
                                roundedCircle
                                width={100}
                                height={100}
                            />
                        ): (
                            <span>No cuentas con avatar</span>
                        )}
                    </div>
                    <Form.Control 
                        type="text"
                        placeholder="pega la URL de tu imagen"
                        name="avatar_url"
                        value={formData.avatar_url}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Button variant="primary" type="submit">Guardar cambios</Button>
            </Form>
        </Container>
    )
}

export default Profile;