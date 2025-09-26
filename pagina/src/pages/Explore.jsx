import React, { useEffect, useState } from "react";
import { Container, Card, Button, Modal } from "react-bootstrap";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import axios from "axios";

import favoriteApi from "../favoriteApi";     // tu cliente axios (baseURL del content/favorites service)
import { useAuth } from "../Auth";
import { getStreamUrl } from "../streamApi";  // exporta getStreamUrl(fileName) desde aquí

const Explore = () => {
  const { user } = useAuth();
  const [contents, setContents] = useState([]);
  const [genres, setGenres] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const [showPlayer, setShowPlayer] = useState(false);
  const [playerTitle, setPlayerTitle] = useState("");
  const [videoSrc, setVideoSrc] = useState("");

  // === Helpers ===
  const ensureMp4 = (name) =>
    name?.toLowerCase().endsWith(".mp4") ? name : `${name}.mp4`;

  // Intenta deducir sample# de varios campos; si no, intenta del título; si no, usa sample{content.id}
  const resolveSampleBase = (c) => {
    const direct =
      c.stream_key ||
      c.video_filename ||
      c.file ||
      c.video ||
      c.sample ||
      c.slug ||
      null;

    if (direct) return direct;

    // intenta extraer "sampleN" del título/descripción
    const fromTitle = `${c.title || ""} ${c.description || ""}`;
    const m = fromTitle.match(/sample\s*(\d+)/i);
    if (m?.[1]) return `sample${m[1]}`;

    // último recurso: usa el id
    if (c.id != null) return `sample${c.id}`;

    return null;
  };

  // === Data ===
  const fetchContentsAndGenres = async () => {
    try {
      const [resContents, resGenres] = await Promise.all([
        favoriteApi.get("/contents"),
        favoriteApi.get("/genres"),
      ]);
      setContents(resContents.data || []);
      setGenres(resGenres.data || []);
    } catch (err) {
      console.error("Error cargando contenidos o géneros:", err.message);
    }
  };

  const fetchFavorites = async () => {
    if (!user?.id) return;
    try {
      const resFavs = await favoriteApi.get(`/favorites/${user.id}`);
      setFavorites((resFavs.data || []).map((f) => f.content.id));
    } catch (err) {
      console.error("Error cargando favoritos:", err.message);
    }
  };

  useEffect(() => {
    fetchContentsAndGenres();
    fetchFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // === Favorites toggle ===
  const toggleFavorite = async (contentId) => {
    if (!user?.id) return;
    try {
      if (favorites.includes(contentId)) {
        await favoriteApi.delete(`/favorites/${user.id}/${contentId}`);
        setFavorites(favorites.filter((id) => id !== contentId));
      } else {
        await favoriteApi.post("/favorites", {
          profile_id: user.id,
          content_id: contentId,
        });
        setFavorites([...favorites, contentId]);
      }
    } catch (err) {
      console.error("Error al actualizar favorito:", err.message);
    }
  };

  // === Player ===
  const playContent = async (content) => {
    const base = resolveSampleBase(content);
    if (!base) {
      alert("Este contenido no tiene archivo de video asociado (sample#).");
      return;
    }
    const filename = ensureMp4(base);

    // getStreamUrl YA devuelve http://host:4000/stream/<archivo>.mp4
    const url = getStreamUrl(filename);

    // Validación rápida para ver si el archivo existe (pedimos 1 byte)
    try {
      const probe = await axios.get(url, {
        headers: { Range: "bytes=0-0" },
        validateStatus: () => true,
      });
      if (probe.status >= 200 && probe.status < 400) {
        setPlayerTitle(content.title || filename);
        setVideoSrc(url);
        setShowPlayer(true);
      } else {
        alert(`No se pudo reproducir.\nURL: ${url}\nStatus: ${probe.status}`);
        console.warn("Stream probe fail:", probe.status, url);
      }
    } catch (e) {
      console.error(e);
      alert(`No se pudo verificar el stream.\nURL: ${url}\nError: ${e?.message || e}`);
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
          (c.genres || []).some((g) => g.id === genre.id)
        );
        if (genreContents.length === 0) return null;

        return (
          <div key={genre.id} className="mb-5">
            <h4>{genre.name}</h4>
            <Carousel responsive={responsive} infinite>
              {genreContents.map((content) => (
                <Card key={content.id} className="mx-2">
                  <Card.Body>
                    <Card.Title>{content.title}</Card.Title>
                    <Card.Text>{content.description}</Card.Text>
                    <Card.Text>
                      <small>Rating: {content.rating}</small>
                    </Card.Text>

                    <div className="d-flex gap-2">
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

                      <Button variant="primary" onClick={() => playContent(content)}>
                        ▶ Reproducir
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </Carousel>
          </div>
        );
      })}

      {/* Modal del reproductor */}
      <Modal show={showPlayer} onHide={() => setShowPlayer(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{playerTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {videoSrc ? (
            <video
              key={videoSrc}
              controls
              style={{ width: "100%", maxHeight: "70vh", background: "#000" }}
              src={videoSrc}
              onError={() => alert("No se pudo cargar el video")}
            />
          ) : (
            <div>Cargando…</div>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Explore;