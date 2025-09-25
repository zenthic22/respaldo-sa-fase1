import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, Button } from "react-bootstrap";
import { useAuth } from "../Auth";

const Favorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);

  // Traer favoritos del usuario
  const fetchFavorites = async () => {
    if (!user?.id) return;
    try {
      const resFavs = await axios.get(
        `http://localhost:3002/api/favorites/${user.id}`
      );
      setFavorites(resFavs.data);
    } catch (err) {
      console.error("Error cargando favoritos:", err.message);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [user]);

  // Quitar favorito
  const removeFavorite = async (contentId) => {
    if (!user?.id) return;
    try {
      await axios.delete(
        `http://localhost:3002/api/favorites/${user.id}/${contentId}`
      );
      setFavorites((prev) =>
        prev.filter((f) => f.content.id !== contentId)
      );
    } catch (err) {
      console.error("Error al quitar favorito:", err.message);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Favoritos de {user?.name}</h2>
      {favorites.length > 0 ? (
        favorites.map((fav) => (
          <Card key={fav.id} className="mb-3">
            <Card.Body>
              <Card.Title>{fav.content.title}</Card.Title>
              <Card.Text>{fav.content.description}</Card.Text>
              <Card.Text>
                <small>Rating: {fav.content.rating}</small>
              </Card.Text>
              <Card.Text>
                <small>Géneros: {fav.content.genres.join(", ")}</small>
              </Card.Text>
              <Button
                variant="danger"
                onClick={() => removeFavorite(fav.content.id)}
              >
                Quitar favorito
              </Button>
            </Card.Body>
          </Card>
        ))
      ) : (
        <p>No tienes favoritos aún.</p>
      )}
    </Container>
  );
};

export default Favorites;