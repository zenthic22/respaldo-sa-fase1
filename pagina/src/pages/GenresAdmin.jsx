import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Table, Button, Form, Modal } from "react-bootstrap";

const GenresAdmin = () => {
  const [genres, setGenres] = useState([]);
  const [newGenre, setNewGenre] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editGenre, setEditGenre] = useState(null);

  const fetchGenres = async () => {
    try {
      const res = await axios.get("http://localhost:3002/api/genres");
      setGenres(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error cargando géneros:", err.message);
      setGenres([]);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  const addGenre = async (e) => {
    e.preventDefault();
    if (!newGenre.trim()) return;

    try {
      const res = await axios.post("http://localhost:3002/api/genres", {
        name: newGenre,
        description: newDescription || null,
      });
      setGenres([...genres, res.data]);
      setNewGenre("");
      setNewDescription("");
    } catch (error) {
      console.error("Error al guardar en backend: ", error.message);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (Array.isArray(data)) {
        for (const genre of data) {
          try {
            const res = await axios.post("http://localhost:3002/api/genres", genre);
            setGenres((prev) => [...prev, res.data]);
          } catch (error) {
            console.error(`Error al guardar genero ${genre.name}: `, error.message);
          }
        }
      } else {
        alert("El archivo JSON debe contener un array de géneros");
      }
    } catch (error) {
      console.error("Error leyendo archivo JSON:", error.message);
      alert("Archivo JSON inválido");
    }
  };

  const deleteGenre = async (id) => {
    try {
      await axios.delete(`http://localhost:3002/api/genres/${id}`);
      setGenres(genres.filter((g) => g.id !== id));
    } catch (err) {
      console.error("Error eliminando género:", err.message);
    }
  };

  const saveEdit = async () => {
    if (!editGenre) return;
    try {
      const res = await axios.put(
        `http://localhost:3002/api/genres/${editGenre.id}`,
        { name: editGenre.name, description: editGenre.description }
      );
      setGenres(genres.map((g) => (g.id === editGenre.id ? res.data : g)));
      setEditGenre(null);
    } catch (err) {
      console.error("Error al actualizar género:", err.message);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Administrar Géneros</h2>

      {/* Formulario para agregar manualmente */}
      <Form onSubmit={addGenre} className="mb-3">
        <Form.Control
          type="text"
          placeholder="Nuevo género"
          value={newGenre}
          onChange={(e) => setNewGenre(e.target.value)}
          className="mb-2"
        />
        <Form.Control
          as="textarea"
          rows={2}
          placeholder="Descripción"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          className="mb-2"
        />
        <Button type="submit" variant="primary">
          Agregar
        </Button>
      </Form>

      {/* Input para carga masiva */}
      <Form.Group controlId="jsonUpload" className="mb-3">
        <Form.Label>Cargar géneros desde archivo JSON</Form.Label>
        <Form.Control type="file" accept=".json" onChange={handleFileUpload} />
      </Form.Group>

      {/* Tabla de géneros */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {genres.map((genre) => (
            <tr key={genre.id}>
              <td>{genre.id}</td>
              <td>{genre.name}</td>
              <td>{genre.description}</td>
              <td>
                <Button
                  variant="success"
                  size="sm"
                  className="me-2"
                  onClick={() => setEditGenre(genre)}
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => deleteGenre(genre.id)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal de edición */}
      <Modal show={!!editGenre} onHide={() => setEditGenre(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Género</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editGenre && (
            <>
              <Form.Group className="mb-2">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  value={editGenre.name}
                  onChange={(e) =>
                    setEditGenre({ ...editGenre, name: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={editGenre.description || ""}
                  onChange={(e) =>
                    setEditGenre({ ...editGenre, description: e.target.value })
                  }
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditGenre(null)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={saveEdit}>
            Guardar cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default GenresAdmin;