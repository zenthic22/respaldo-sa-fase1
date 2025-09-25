import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { useAuth } from "../Auth";

const Explore = () => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [activeProfile, setActiveProfile] = useState(null);
  const [contents, setContents] = useState([]);
  const [genres, setGenres] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Traer perfiles del usuario
  const fetchProfiles = async () => {
    try {
      const res = await axios.get(`http://localhost:3002/api/profiles/user/${user.id}`);
      setProfiles(res.data);
      if (res.data.length > 0) setActiveProfile(res.data[0]); // seleccionar el primero por defecto
    } catch (err) {
      console.error("Error cargando perfiles:", err.message);
    }
  };

  // Traer contenidos y géneros
  const fetchContentsAndGenres = async () => {
    try {
      const [resContents, resGenres] = await Promise.all([
        axios.get("http://localhost:3002/api/contents"),
        axios.get("http://localhost:3002/api/genres"),
      ]);
      setContents(resContents.data);
      setGenres(resGenres.data);
    } catch (err) {
      console.error("Error cargando contenidos o géneros:", err.message);
    }
  };

  // Traer favoritos del perfil activo
  const fetchFavorites = async (profileId) => {
    if (!profileId) return;
    try {
      const resFavs = await axios.get(`http://localhost:3002/api/favorites/${profileId}`);
      setFavorites(resFavs.data.map((f) => f.content_id));
    } catch (err) {
      console.error("Error cargando favoritos:", err.message);
    }
  };

  useEffect(() => {
    fetchProfiles();
    fetchContentsAndGenres();
  }, []);

  useEffect(() => {
    if (activeProfile) {
      fetchFavorites(activeProfile.id);
    }
  }, [activeProfile]);

  // Toggle favoritos
  const toggleFavorite = async (contentId) => {
    if (!activeProfile) return;
    try {
      if (favorites.includes(contentId)) {
        await axios.delete(
          `http://localhost:3002/api/favorites/${activeProfile.id}/${contentId}`
        );
        setFavorites(favorites.filter((id) => id !== contentId));
      } else {
        await axios.post("http://localhost:3002/api/favorites", {
          profile_id: activeProfile.id,
          content_id: contentId,
        });
        setFavorites([...favorites, contentId]);
      }
    } catch (err) {
      console.error("Error al actualizar favorito:", err.message);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Explorar Contenidos</h2>

      {/* Selector de perfil */}
      <Form.Group className="mb-3">
        <Form.Label>Perfil activo:</Form.Label>
        <Form.Select
          value={activeProfile?.id || ""}
          onChange={(e) =>
            setActiveProfile(profiles.find((p) => p.id === parseInt(e.target.value)))
          }
        >
          {profiles.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {/* Carruseles por género */}
      {genres.map((genre) => {
        const genreContents = contents.filter((c) =>
          c.genres.some((g) => g.id === genre.id)
        );
        if (genreContents.length === 0) return null;

        return (
          <div key={genre.id} className="mb-5">
            <h4>{genre.name}</h4>
            <Row className="flex-row flex-nowrap overflow-auto">
              {genreContents.map((content) => (
                <Col key={content.id} style={{ minWidth: "250px" }}>
                  <Card className="mb-3">
                    <Card.Body>
                      <Card.Title>{content.title}</Card.Title>
                      <Card.Text>{content.description}</Card.Text>
                      <Card.Text>
                        <small>Rating: {content.rating}</small>
                      </Card.Text>
                      <Button
                        variant={
                          favorites.includes(content.id) ? "danger" : "outline-danger"
                        }
                        onClick={() => toggleFavorite(content.id)}
                      >
                        {favorites.includes(content.id)
                          ? "★ Quitar favorito"
                          : "☆ Agregar favorito"}
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        );
      })}
    </Container>
  );
};

export default Explore;