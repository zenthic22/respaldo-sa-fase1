import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, Button } from "react-bootstrap";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useAuth } from "../Auth";

const Explore = () => {
  const { user } = useAuth();
  const [contents, setContents] = useState([]);
  const [genres, setGenres] = useState([]);
  const [favorites, setFavorites] = useState([]);

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

  // Traer favoritos del usuario
  const fetchFavorites = async () => {
    if (!user?.id) return;
    try {
      const resFavs = await axios.get(
        `http://localhost:3002/api/favorites/${user.id}`
      );
      setFavorites(resFavs.data.map((f) => f.content.id));
    } catch (err) {
      console.error("Error cargando favoritos:", err.message);
    }
  };

  useEffect(() => {
    fetchContentsAndGenres();
    fetchFavorites();
  }, [user]);

  // Toggle favorito
  const toggleFavorite = async (contentId) => {
    if (!user?.id) return;
    try {
      if (favorites.includes(contentId)) {
        await axios.delete(
          `http://localhost:3002/api/favorites/${user.id}/${contentId}`
        );
        setFavorites(favorites.filter((id) => id !== contentId));
      } else {
        await axios.post("http://localhost:3002/api/favorites", {
          profile_id: user.id,
          content_id: contentId,
        });
        setFavorites([...favorites, contentId]);
      }
    } catch (err) {
      console.error("Error al actualizar favorito:", err.message);
    }
  };

  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 1024 }, items: 5 },
    desktop: { breakpoint: { max: 1024, min: 768 }, items: 3 },
    tablet: { breakpoint: { max: 768, min: 464 }, items: 2 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
  };

  return (
    <Container className="mt-4">
      <h2>Explorar Contenidos</h2>
      {genres.map((genre) => {
        const genreContents = contents.filter((c) =>
          c.genres.some((g) => g.id === genre.id)
        );
        if (genreContents.length === 0) return null;

        return (
          <div key={genre.id} className="mb-5">
            <h4>{genre.name}</h4>
            <Carousel responsive={responsive} infinite={true}>
              {genreContents.map((content) => (
                <Card key={content.id} className="mx-2">
                  <Card.Body>
                    <Card.Title>{content.title}</Card.Title>
                    <Card.Text>{content.description}</Card.Text>
                    <Card.Text>
                      <small>Rating: {content.rating}</small>
                    </Card.Text>
                    <Button
                      variant={
                        favorites.includes(content.id)
                          ? "danger"
                          : "outline-danger"
                      }
                      onClick={() => toggleFavorite(content.id)}
                    >
                      {favorites.includes(content.id)
                        ? "★ Quitar favorito"
                        : "☆ Agregar favorito"}
                    </Button>
                  </Card.Body>
                </Card>
              ))}
            </Carousel>
          </div>
        );
      })}
    </Container>
  );
};

export default Explore;