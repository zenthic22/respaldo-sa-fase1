import React, { useState } from "react";
import { Container, Tabs, Tab } from "react-bootstrap";
import GenresAdmin from "./GenresAdmin";
import ContentsAdmin from "./Contents";

const ContentAdmin = () => {
    const [key, setKey] = useState("genres");

    return (
        <Container className="mt-4">
        <h2>Administrar Contenido</h2>
        <Tabs
            id="content-admin-tabs"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-3"
        >
            <Tab eventKey="genres" title="Géneros">
            <GenresAdmin />
            </Tab>
            <Tab eventKey="contents" title="Películas / Series">
            <ContentsAdmin />
            </Tab>
        </Tabs>
        </Container>
    );
}

export default ContentAdmin;