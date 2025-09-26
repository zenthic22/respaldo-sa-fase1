import React, { useEffect, useState } from "react";
import contentApi from "../contentApi";
import { Container, Table, Button, Form, Modal, Image } from "react-bootstrap";

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
    video_filename: "", // 👈 nuevo
    poster_url: "",     // 👈 nuevo
    genres: [],
  });
  const [editContent, setEditContent] = useState(null);
  const [bulkJson, setBulkJson] = useState("");

  const fetchContents = async () => {
    try {
      const res = await contentApi.get("/contents");
      setContents(res.data || []);
    } catch (err) {
      console.error("Error cargando contenidos:", err.message);
    }
  };

  const fetchGenres = async () => {
    try {
      const res = await contentApi.get("/genres");
      setGenres(res.data || []);
    } catch (err) {
      console.error("Error cargando géneros:", err.message);
    }
  };

  useEffect(() => {
    fetchContents();
    fetchGenres();
  }, []);

  const toNumberOrNull = (v) => (v === "" || v === null || typeof v === "undefined" ? null : Number(v));

  // Crear contenido individual
  const addContent = async (e) => {
    e.preventDefault();
    try {
      await contentApi.post("/contents", {
        ...newContent,
        rating: toNumberOrNull(newContent.rating),
        duration: toNumberOrNull(newContent.duration),
      });
      await fetchContents();
      setNewContent({
        title: "",
        description: "",
        release_date: "",
        type: "MOVIE",
        rating: "",
        duration: "",
        video_filename: "",
        poster_url: "",
        genres: [],
      });
    } catch (err) {
      console.error("Error creando contenido:", err.message);
    }
  };

  // Carga masiva
  const handleBulkUpload = async () => {
    try {
      const data = JSON.parse(bulkJson);
      for (const item of data) {
        await contentApi.post("/contents", item);
      }
      await fetchContents();
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
      await contentApi.delete(`/contents/${id}`);
      setContents((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Error eliminando contenido:", err.message);
    }
  };

  // Guardar edición
  const saveEdit = async () => {
    if (!editContent) return;
    try {
      await contentApi.put(`/contents/${editContent.id}`, {
        title: editContent.title,
        description: editContent.description,
        release_date: editContent.release_date,
        type: editContent.type,
        rating: toNumberOrNull(editContent.rating),
        duration: toNumberOrNull(editContent.duration),
        video_filename: editContent.video_filename || null,
        poster_url: editContent.poster_url || null,
        genres: (editContent.genres || []).map((g) => g.id),
      });
      await fetchContents();
      setEditContent(null);
    } catch (err) {
      console.error("Error actualizando contenido:", err.message);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Administrar Contenidos</h2>

      {/* Formulario de creación */}
      <Form onSubmit={addContent} className="mb-4">
        <Form.Control
          type="text"
          placeholder="Título"
          value={newContent.title}
          onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
          className="mb-2"
          required
        />

        <Form.Control
          as="textarea"
          rows={2}
          placeholder="Descripción"
          value={newContent.description}
          onChange={(e) => setNewContent({ ...newContent, description: e.target.value })}
          className="mb-2"
        />

        <Form.Control
          type="date"
          value={newContent.release_date}
          onChange={(e) => setNewContent({ ...newContent, release_date: e.target.value })}
          className="mb-2"
        />

        <Form.Select
          value={newContent.type}
          onChange={(e) => setNewContent({ ...newContent, type: e.target.value })}
          className="mb-2"
        >
          <option value="MOVIE">Película</option>
          <option value="SERIES">Serie</option>
        </Form.Select>

        <div className="d-flex gap-2">
          <Form.Control
            type="number"
            step="0.1"
            placeholder="Rating"
            value={newContent.rating}
            onChange={(e) => setNewContent({ ...newContent, rating: e.target.value })}
            className="mb-2"
          />
          <Form.Control
            type="number"
            placeholder="Duración (min)"
            value={newContent.duration}
            onChange={(e) => setNewContent({ ...newContent, duration: e.target.value })}
            className="mb-2"
          />
        </div>

        {/* video_filename (texto) */}
        <Form.Control
          type="text"
          placeholder="video_filename (ej: sample42.mp4)"
          value={newContent.video_filename}
          onChange={(e) => setNewContent({ ...newContent, video_filename: e.target.value })}
          className="mb-2"
        />

        {/* Seleccionar archivo local (solo toma el nombre) */}
        <Form.Group className="mb-2">
          <Form.Label>Seleccionar archivo de video (no se sube, solo toma el nombre)</Form.Label>
          <Form.Control
            type="file"
            accept="video/mp4"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setNewContent({ ...newContent, video_filename: file.name });
            }}
          />
          <Form.Text muted>
            Copia este archivo manualmente al VIDEO_DIR del servicio de streaming.
          </Form.Text>
        </Form.Group>

        {/* poster_url */}
        <Form.Control
          type="text"
          placeholder="poster_url (opcional)"
          value={newContent.poster_url}
          onChange={(e) => setNewContent({ ...newContent, poster_url: e.target.value })}
          className="mb-3"
        />

        {/* Géneros */}
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
                  setNewContent({ ...newContent, genres: [...newContent.genres, g.id] });
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
          placeholder={`[
  {
    "title":"La Gran Aventura",
    "description":"Película animada...",
    "release_date":"2020-12-20",
    "type":"MOVIE",
    "rating":8.0,
    "duration":95,
    "video_filename":"sample1.mp4",
    "poster_url":"https://example.com/posters/p1.jpg",
    "genres":[1,2]
  },
  {
    "title":"Drama Intenso",
    "type":"MOVIE",
    "video_filename":"mi_pelicula_larga.mp4",
    "genres":[3]
  }
]`}
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
            <th>Video</th>
            <th>Poster</th>
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
              <td>{c.video_filename || <em className="text-muted">—</em>}</td>
              <td>
                {c.poster_url ? (
                  <Image
                    src={c.poster_url}
                    alt="poster"
                    style={{ width: 50, height: 50, objectFit: "cover" }}
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                ) : (
                  <em className="text-muted">—</em>
                )}
              </td>
              <td>{(c.genres || []).map((g) => g.name).join(", ")}</td>
              <td>
                <Button
                  size="sm"
                  variant="success"
                  className="me-2"
                  onClick={() => setEditContent(c)}
                >
                  Editar
                </Button>
                <Button size="sm" variant="danger" onClick={() => deleteContent(c.id)}>
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
                value={editContent.title || ""}
                onChange={(e) => setEditContent({ ...editContent, title: e.target.value })}
              />
              <Form.Control
                as="textarea"
                rows={2}
                className="mb-2"
                value={editContent.description || ""}
                onChange={(e) => setEditContent({ ...editContent, description: e.target.value })}
              />
              <Form.Control
                type="date"
                className="mb-2"
                value={editContent.release_date?.split("T")[0] || ""}
                onChange={(e) => setEditContent({ ...editContent, release_date: e.target.value })}
              />
              <Form.Select
                className="mb-2"
                value={editContent.type || "MOVIE"}
                onChange={(e) => setEditContent({ ...editContent, type: e.target.value })}
              >
                <option value="MOVIE">Película</option>
                <option value="SERIES">Serie</option>
              </Form.Select>

              <div className="d-flex gap-2">
                <Form.Control
                  type="number"
                  step="0.1"
                  className="mb-2"
                  value={editContent.rating ?? ""}
                  onChange={(e) => setEditContent({ ...editContent, rating: e.target.value })}
                />
                <Form.Control
                  type="number"
                  className="mb-2"
                  value={editContent.duration ?? ""}
                  onChange={(e) => setEditContent({ ...editContent, duration: e.target.value })}
                />
              </div>

              {/* Selector de archivo local (solo toma el nombre) */}
              <Form.Group className="mb-2">
                <Form.Label>Seleccionar archivo de video (no se sube, solo toma el nombre)</Form.Label>
                <Form.Control
                  type="file"
                  accept="video/mp4"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setEditContent({ ...editContent, video_filename: file.name });
                  }}
                />
                <Form.Text muted>
                  Recuerda mover este archivo al VIDEO_DIR del servicio de streaming.
                </Form.Text>
              </Form.Group>

              {/* poster_url */}
              <Form.Control
                type="text"
                className="mb-2"
                placeholder="poster_url (opcional)"
                value={editContent.poster_url || ""}
                onChange={(e) =>
                  setEditContent({ ...editContent, poster_url: e.target.value })
                }
              />

              <Form.Group className="mb-2">
                <Form.Label>Géneros</Form.Label>
                {genres.map((g) => {
                  const checked = (editContent.genres || []).some((gen) => gen.id === g.id);
                  return (
                    <Form.Check
                      key={g.id}
                      type="checkbox"
                      label={g.name}
                      checked={checked}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setEditContent({
                            ...editContent,
                            genres: [...(editContent.genres || []), { id: g.id, name: g.name }],
                          });
                        } else {
                          setEditContent({
                            ...editContent,
                            genres: (editContent.genres || []).filter((gen) => gen.id !== g.id),
                          });
                        }
                      }}
                    />
                  );
                })}
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