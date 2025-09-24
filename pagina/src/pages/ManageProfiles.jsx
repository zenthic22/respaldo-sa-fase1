import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Modal, Form, Alert, Image } from "react-bootstrap";
import { useAuth } from "../Auth";
import userApi from "../userApi";

const ManageProfiles = () => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newProfile, setNewProfile] = useState({ name: "", avatar_url: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Cargar perfiles del usuario
  const fetchProfiles = async () => {
    try {
      const response = await userApi.get(`/profiles/user/${user.id}`);
      setProfiles(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleCreate = async () => {
    setError("");
    setSuccess("");

    if (!newProfile.name.trim()) {
      setError("El nombre del perfil es obligatorio");
      return;
    }

    try {
      await userApi.post("/profiles", { 
        user_id: user.id, 
        name: newProfile.name, 
        avatar_url: newProfile.avatar_url || null 
      });
      setSuccess("Perfil creado correctamente!");
      setNewProfile({ name: "", avatar_url: "" });
      setShowModal(false);
      fetchProfiles();
    } catch (err) {
      setError(err.response?.data?.message || "Error al crear perfil");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este perfil?")) return;
    try {
      await userApi.delete(`/profiles/${id}`);
      fetchProfiles();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Administrar Perfiles</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Button className="mb-3" onClick={() => setShowModal(true)} disabled={profiles.length >= 5}>
        Crear nuevo perfil
      </Button>

      <Row>
        {profiles.map(profile => (
          <Col md={4} lg={3} className="mb-3" key={profile.id}>
            <Card>
              <Card.Body className="text-center">
                {profile.avatar_url ? (
                  <Image src={profile.avatar_url} roundedCircle width={80} height={80} />
                ) : (
                  <span>Sin avatar</span>
                )}
                <Card.Title className="mt-2">{profile.name}</Card.Title>

                <Button 
                  variant="danger" 
                  size="sm" 
                  onClick={() => handleDelete(profile.id)} 
                  className="mt-1"
                >
                  Eliminar
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal para crear perfil */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Perfil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre del perfil</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newProfile.name}
                onChange={handleChange}
                placeholder="Nombre del perfil"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Avatar (URL)</Form.Label>
              <Form.Control
                type="text"
                name="avatar_url"
                value={newProfile.avatar_url}
                onChange={handleChange}
                placeholder="Opcional"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleCreate}>Crear perfil</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ManageProfiles;