import React, { useEffect, useState } from "react";
import favoriteApi from "../favoriteApi";
import { Container, Card, Button, Modal, Image, Badge } from "react-bootstrap";
import axios from "axios";
import { useAuth } from "../Auth";
import { getStreamUrl } from "../streamApi";

const Favorites = () => {
  const { user } = useAuth();
  const profileId = user?.id; // si manejas perfiles múltiples, sustituye por el perfil activo

  const [favorites, setFavorites] = useState([]);
  const [showPlayer, setShowPlayer] = useState(false);
  const [playerTitle, setPlayerTitle] = useState("");
  const [videoSrc, setVideoSrc] = useState("");

  const ensureMp4 = (name) =>
    name?.toLowerCase().endsWith(".mp4") ? name : `${name}.mp4`;

  const fetchFavorites = async () => {
    if (!profileId) return;
    try {
      const res = await favoriteApi.get(`/favorites/${profileId}`);
      setFavorites(res.data || []);
    } catch (err) {
      console.error("Error cargando favoritos:", err.message);
    }
  };

  useEffect(() => {
    fetchFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileId]);

  const removeFavorite = async (contentId) => {
    if (!profileId) return;
    try {
      await favoriteApi.delete(`/favorites/${profileId}/${contentId}`);
      setFavorites((prev) => prev.filter((f) => f.content.id !== contentId));
    } catch (err) {
      console.error("Error al quitar favorito:", err.message);
    }
  };

  const playFavorite = async (fav) => {
    const c = fav.content || {};
    if (!c.video_filename) {
      alert("Este favorito no tiene 'video_filename' asignado.");
      return;
    }
    const filename = ensureMp4(c.video_filename);
    const url = getStreamUrl(filename); // ✅ ya incluye /stream/archivo.mp4

    try {
      // Sonda rápida (1 byte) para validar que el archivo exista
      const probe = await axios.get(url, {
        headers: { Range: "bytes=0-0" },
        validateStatus: () => true,
      });
      if (probe.status >= 200 && probe.status < 400) {
        setPlayerTitle(c.title || filename);
        setVideoSrc(url);
        setShowPlayer(true);
      } else {
        alert(`No se pudo reproducir.\nURL: ${url}\nStatus: ${probe.status}`);
      }
    } catch (e) {
      console.error(e);
      alert(`No se pudo verificar el stream.\nURL: ${url}\nError: ${e?.message || e}`);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Mis favoritos</h2>

      {favorites.length > 0 ? (
        favorites.map((fav) => {
          const c = fav.content || {};
          const genreBadges = Array.isArray(c.genres)
            ? c.genres.map((g, idx) =>
                typeof g === "string" ? (
                  <Badge bg="secondary" className="me-1" key={`${c.id}-g-${idx}`}>
                    {g}
                  </Badge>
                ) : (
                  <Badge
                    bg="secondary"
                    className="me-1"
                    key={g.id ?? `${c.id}-g-${idx}`}
                  >
                    {g.name}
                  </Badge>
                )
              )
            : null;

          return (
            <Card key={fav.id ?? `${c.id}-fav`} className="mb-3">
              <Card.Body className="d-flex gap-3">
                {c.poster_url ? (
                  <Image
                    src={c.poster_url}
                    alt="poster"
                    style={{ width: 80, height: 80, objectFit: "cover" }}
                    rounded
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                ) : null}

                <div className="flex-grow-1">
                  <Card.Title className="mb-1">{c.title}</Card.Title>

                  <div className="mb-2">{genreBadges}</div>

                  <Card.Text className="mb-1">
                    <small>Rating: {c.rating ?? "—"}</small>
                  </Card.Text>
                  <Card.Text className="text-muted">{c.description}</Card.Text>

                  <div className="d-flex gap-2">
                    <Button variant="primary" onClick={() => playFavorite(fav)}>
                      ▶ Reproducir
                    </Button>
                    <Button variant="danger" onClick={() => removeFavorite(c.id)}>
                      Quitar favorito
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          );
        })
      ) : (
        <p>No tienes favoritos aún.</p>
      )}

      {/* Modal de reproducción */}
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

export default Favorites;