import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Table, Button, Form, Modal } from "react-bootstrap";

const ContentsAdmin = () => {
  const [contents, setContents] = useState([]);
  const [genres, setGenres] = useState([]);
  const [newContent, setNewContent] = useState({
    title: "",
    description: "",
    release_date: "",
    type: "MOVIE",
    rating: "",
    duration: "",
    genres: [],
  });
  const [editContent, setEditContent] = useState(null);
  const [bulkJson, setBulkJson] = useState(""); // para carga masiva

  // Cargar contenidos con géneros
  const fetchContents = async () => {
    try {
      const res = await axios.get("http://localhost:3002/api/contents");
      setContents(res.data);
    } catch (err) {
      console.error("Error cargando contenidos:", err.message);
    }
  };

  // Cargar géneros
  const fetchGenres = async () => {
    try {
      const res = await axios.get("http://localhost:3002/api/genres");
      setGenres(res.data);
    } catch (err) {
      console.error("Error cargando géneros:", err.message);
    }
  };

  useEffect(() => {
    fetchContents();
    fetchGenres();
  }, []);

  // Crear contenido individual
  const addContent = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3002/api/contents", newContent);
      fetchContents();
      setNewContent({
        title: "",
        description: "",
        release_date: "",
        type: "MOVIE",
        rating: "",
        duration: "",
        genres: [],
      });
    } catch (err) {
      console.error("Error creando contenido:", err.message);
    }
  };

  // Carga masiva desde JSON
  const handleBulkUpload = async () => {
    try {
      const data = JSON.parse(bulkJson);
      for (let item of data) {
        await axios.post("http://localhost:3002/api/contents", item);
      }
      fetchContents();
      setBulkJson("");
      alert("Carga masiva completada");
    } catch (err) {
      console.error("Error en carga masiva:", err.message);
      alert("Error en carga masiva. Ver consola.");
    }
  };

  // Eliminar contenido
  const deleteContent = async (id) => {
    try {
      await axios.delete(`http://localhost:3002/api/contents/${id}`);
      setContents(contents.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Error eliminando contenido:", err.message);
    }
  };

  // Guardar edición
  const saveEdit = async () => {
    try {
      await axios.put(
        `http://localhost:3002/api/contents/${editContent.id}`,
        {
          title: editContent.title,
          description: editContent.description,
          release_date: editContent.release_date,
          type: editContent.type,
          rating: editContent.rating,
          duration: editContent.duration,
          genres: editContent.genres.map((g) => g.id),
        }
      );
      fetchContents();
      setEditContent(null);
    } catch (err) {
      console.error("Error actualizando contenido:", err.message);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Administrar Contenidos</h2>

      {/* Formulario de creación individual */}
      <Form onSubmit={addContent} className="mb-4">
        <Form.Control
          type="text"
          placeholder="Título"
          value={newContent.title}
          onChange={(e) =>
            setNewContent({ ...newContent, title: e.target.value })
          }
          className="mb-2"
        />
        <Form.Control
          as="textarea"
          rows={2}
          placeholder="Descripción"
          value={newContent.description}
          onChange={(e) =>
            setNewContent({ ...newContent, description: e.target.value })
          }
          className="mb-2"
        />
        <Form.Control
          type="date"
          value={newContent.release_date}
          onChange={(e) =>
            setNewContent({ ...newContent, release_date: e.target.value })
          }
          className="mb-2"
        />
        <Form.Select
          value={newContent.type}
          onChange={(e) =>
            setNewContent({ ...newContent, type: e.target.value })
          }
          className="mb-2"
        >
          <option value="MOVIE">Película</option>
          <option value="SERIES">Serie</option>
        </Form.Select>
        <Form.Control
          type="number"
          step="0.1"
          placeholder="Rating"
          value={newContent.rating}
          onChange={(e) =>
            setNewContent({ ...newContent, rating: e.target.value })
          }
          className="mb-2"
        />
        <Form.Control
          type="number"
          placeholder="Duración (min)"
          value={newContent.duration}
          onChange={(e) =>
            setNewContent({ ...newContent, duration: e.target.value })
          }
          className="mb-2"
        />
        <Form.Group className="mb-2">
          <Form.Label>Géneros</Form.Label>
          {genres.map((g) => (
            <Form.Check
              key={g.id}
              type="checkbox"
              label={g.name}
              checked={newContent.genres.includes(g.id)}
              onChange={(e) => {
                if (e.target.checked) {
                  setNewContent({
                    ...newContent,
                    genres: [...newContent.genres, g.id],
                  });
                } else {
                  setNewContent({
                    ...newContent,
                    genres: newContent.genres.filter((id) => id !== g.id),
                  });
                }
              }}
            />
          ))}
        </Form.Group>
        <Button type="submit">Agregar Contenido</Button>
      </Form>

      {/* Carga masiva */}
      <Form className="mb-4">
        <Form.Label>Carga Masiva de Contenidos (JSON)</Form.Label>
        <Form.Control
          as="textarea"
          rows={6}
          value={bulkJson}
          onChange={(e) => setBulkJson(e.target.value)}
          placeholder='[
  {"title":"La Gran Aventura","description":"Película animada...","release_date":"2020-12-20","type":"MOVIE","rating":8,"duration":95,"genres":[1]},
  {"title":"Drama Intenso",...}
]'
        />
        <Button className="mt-2" variant="primary" onClick={handleBulkUpload}>
          Cargar Masivamente
        </Button>
      </Form>

      {/* Tabla de contenidos */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Tipo</th>
            <th>Rating</th>
            <th>Géneros</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {contents.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.title}</td>
              <td>{c.type}</td>
              <td>{c.rating}</td>
              <td>{c.genres.map((g) => g.name).join(", ")}</td>
              <td>
                <Button
                  size="sm"
                  variant="success"
                  className="me-2"
                  onClick={() => setEditContent(c)}
                >
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => deleteContent(c.id)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal de edición */}
      <Modal show={!!editContent} onHide={() => setEditContent(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Contenido</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editContent && (
            <>
              <Form.Control
                type="text"
                className="mb-2"
                value={editContent.title}
                onChange={(e) =>
                  setEditContent({ ...editContent, title: e.target.value })
                }
              />
              <Form.Control
                as="textarea"
                rows={2}
                className="mb-2"
                value={editContent.description}
                onChange={(e) =>
                  setEditContent({ ...editContent, description: e.target.value })
                }
              />
              <Form.Control
                type="date"
                className="mb-2"
                value={editContent.release_date?.split("T")[0] || ""}
                onChange={(e) =>
                  setEditContent({ ...editContent, release_date: e.target.value })
                }
              />
              <Form.Select
                className="mb-2"
                value={editContent.type}
                onChange={(e) =>
                  setEditContent({ ...editContent, type: e.target.value })
                }
              >
                <option value="MOVIE">Película</option>
                <option value="SERIES">Serie</option>
              </Form.Select>
              <Form.Control
                type="number"
                step="0.1"
                className="mb-2"
                value={editContent.rating}
                onChange={(e) =>
                  setEditContent({ ...editContent, rating: e.target.value })
                }
              />
              <Form.Control
                type="number"
                className="mb-2"
                value={editContent.duration}
                onChange={(e) =>
                  setEditContent({ ...editContent, duration: e.target.value })
                }
              />
              <Form.Group className="mb-2">
                <Form.Label>Géneros</Form.Label>
                {genres.map((g) => (
                  <Form.Check
                    key={g.id}
                    type="checkbox"
                    label={g.name}
                    checked={editContent.genres.some((gen) => gen.id === g.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setEditContent({
                          ...editContent,
                          genres: [...editContent.genres, { id: g.id, name: g.name }],
                        });
                      } else {
                        setEditContent({
                          ...editContent,
                          genres: editContent.genres.filter(
                            (gen) => gen.id !== g.id
                          ),
                        });
                      }
                    }}
                  />
                ))}
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditContent(null)}>
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

export default ContentsAdmin;