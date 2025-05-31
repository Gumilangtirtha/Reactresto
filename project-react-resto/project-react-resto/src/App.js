import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import Navigation from './components/navigation';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Container fluid>
          <Row>
            <Col md={3} lg={2} className="sidebar">
              <div className="sidebar-sticky">
                <h3 className="mt-3 mb-4 text-center">Nav</h3>
                <Navigation />
              </div>
            </Col>
            <Col md={9} lg={10} className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/kategori" element={<ComingSoon title="Kategori" />} />
                <Route path="/menu" element={<ComingSoon title="Menu" />} />
                <Route path="/pelanggan" element={<ComingSoon title="Pelanggan" />} />
                <Route path="/order" element={<ComingSoon title="Order" />} />
                <Route path="/order-detail" element={<ComingSoon title="Order Detail" />} />
                <Route path="/admin" element={<ComingSoon title="Admin" />} />
              </Routes>
            </Col>
          </Row>
        </Container>
      </div>
    </Router>
  );
}

// Home component
const Home = () => {
  return (
    <div className="p-4">
      <h2>Selamat Datang di Aplikasi Manajemen Restoran</h2>
      <p className="mt-3">
        Silahkan pilih menu di sidebar untuk mengakses fitur aplikasi.
      </p>
    </div>
  );
};

// Placeholder component for pages that are not yet implemented
const ComingSoon = ({ title }) => {
  return (
    <div className="p-4">
      <h2>{title}</h2>
      <p className="mt-3">
        Halaman ini sedang dalam pengembangan. Silahkan coba lagi nanti.
      </p>
    </div>
  );
};

export default App;
