import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Image } from "react-bootstrap";
import { useAuth } from "../Auth";
import userApi from "../userApi";

const ProfileView = () => {
    const { user, login } = useAuth();
    const [userData, setUserData] = useState(user);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await userApi.get(`/users/${user.id}`);
                const apiUser = response.data;

                const updatedUser = {
                    id: apiUser.id,
                    email: apiUser.email,
                    name: apiUser.first_name,
                    lastname: apiUser.last_name,
                    phone: apiUser.phone,
                    avatar_url: apiUser.avatar_url,
                    role: apiUser.role || "USER"
                }

                setUserData(updatedUser);
                
                login({
                    accessToken: localStorage.getItem("accessToken"),
                    refreshToken: localStorage.getItem("refreshToken"),
                    user: updatedUser
                });
            } catch (error) {
                console.error("Error al obtener usuario:", err);
            }
        };
        if (user?.id) fetchUser();
    }, [user?.id, login]);

    if (!userData) return <p>Cargando...</p>

    return (
        <Container style={{ maxWidth: "600px" }} className="mt-4">
            <h2>Mi Perfil</h2>
            <Card>
                <Card.Body>
                    <Row className="mb-3">
                        <Col md={4}>
                            {userData.avatar_url ? (
                                <Image 
                                    src={userData.avatar_url} 
                                    roundedCircle 
                                    width={120} 
                                    height={120} 
                                />
                            ) : (
                                <span>No hay avatar</span>
                            )}
                        </Col>
                        <Col md={8}>
                            <p><strong>Nombre:</strong> {userData.name}</p>
                            <p><strong>Apellido:</strong> {userData.lastname}</p>
                            <p><strong>Correo:</strong> {userData.email}</p>
                            <p><strong>Teléfono:</strong> {userData.phone || "No proporcionado"}</p>
                            <p><strong>Rol:</strong> {userData.role}</p>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ProfileView;