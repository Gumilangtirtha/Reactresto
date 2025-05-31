import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import HeroCard from '../components/HeroCard';
import HeroFilter from '../components/HeroFilter';
import HeroModal from '../components/HeroModal';
import { getHeroes, addHero, updateHero, deleteHero, searchHeroes, sortHeroes } from '../data/heroesData';
import { isAdmin } from '../utils/auth';

const MenuPage = () => {
  const [heroes, setHeroes] = useState([]);
  const [filteredHeroes, setFilteredHeroes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [showModal, setShowModal] = useState(false);
  const [selectedHero, setSelectedHero] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHeroes();
  }, []);

  useEffect(() => {
    filterAndSortHeroes();
  }, [heroes, searchTerm, selectedRole, sortBy]);

  const loadHeroes = () => {
    try {
      const heroesData = getHeroes();
      setHeroes(heroesData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading heroes:', error);
      showAlert('Error loading heroes', 'danger');
      setLoading(false);
    }
  };

  const filterAndSortHeroes = () => {
    let filtered = heroes;

    // Apply search filter
    if (searchTerm) {
      filtered = searchHeroes(searchTerm);
    }

    // Apply role filter
    if (selectedRole !== 'All') {
      filtered = filtered.filter(hero => hero.role === selectedRole);
    }

    // Apply sorting
    filtered = sortHeroes(filtered, sortBy);

    setFilteredHeroes(filtered);
  };

  const showAlert = (message, variant = 'success') => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: 'success' }), 3000);
  };

  const handleAddHero = () => {
    setSelectedHero(null);
    setIsEdit(false);
    setShowModal(true);
  };

  const handleEditHero = (hero) => {
    setSelectedHero(hero);
    setIsEdit(true);
    setShowModal(true);
  };

  const handleDeleteHero = (hero) => {
    if (window.confirm(`Are you sure you want to delete ${hero.name}?`)) {
      try {
        deleteHero(hero.id);
        loadHeroes();
        showAlert(`${hero.name} has been deleted successfully`, 'success');
      } catch (error) {
        console.error('Error deleting hero:', error);
        showAlert('Error deleting hero', 'danger');
      }
    }
  };

  const handleSaveHero = async (heroData) => {
    try {
      if (isEdit) {
        updateHero({ ...heroData, id: selectedHero.id });
        showAlert(`${heroData.name} has been updated successfully`, 'success');
      } else {
        addHero(heroData);
        showAlert(`${heroData.name} has been added successfully`, 'success');
      }
      loadHeroes();
    } catch (error) {
      console.error('Error saving hero:', error);
      showAlert('Error saving hero', 'danger');
      throw error;
    }
  };

  const handleSelectHero = (hero) => {
    showAlert(`${hero.name} selected! Ready for battle!`, 'info');
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedRole('All');
    setSortBy('name');
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="ml-loading mx-auto mb-3"></div>
        <p>Loading heroes...</p>
      </div>
    );
  }

  return (
    <div className="hero-management-page">
      <Container fluid className="px-4">
        {/* Hero Header Section */}
        <div className="hero-header-section">
          <div className="hero-header-content">
            <div className="hero-title-container">
              <h1 className="hero-main-title">
                <span className="title-icon">⚔️</span>
                Hero Arsenal
                <span className="title-icon">⚔️</span>
              </h1>
              <p className="hero-subtitle">
                Master the legends • Choose your champion • Dominate the battlefield
              </p>
            </div>

            {isAdmin() && (
              <div className="hero-admin-actions">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleAddHero}
                  className="add-hero-btn"
                >
                  <span className="btn-icon">🎮</span>
                  Create New Hero
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Alert Section */}
        {alert.show && (
          <div className="alert-container">
            <Alert variant={alert.variant} onClose={() => setAlert({...alert, show: false})} dismissible>
              <div className="d-flex align-items-center">
                <span className="alert-icon me-2">
                  {alert.variant === 'success' && '✅'}
                  {alert.variant === 'danger' && '❌'}
                  {alert.variant === 'info' && 'ℹ️'}
                  {alert.variant === 'warning' && '⚠️'}
                </span>
                {alert.message}
              </div>
            </Alert>
          </div>
        )}

        {/* Hero Statistics Bar */}
        <div className="hero-stats-bar">
          <div className="stats-container">
            <div className="stat-item">
              <div className="stat-number">{heroes.length}</div>
              <div className="stat-label">Total Heroes</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">{filteredHeroes.length}</div>
              <div className="stat-label">Showing</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">{new Set(heroes.map(h => h.role)).size}</div>
              <div className="stat-label">Roles</div>
            </div>
          </div>
        </div>

        {/* Hero Filter Section */}
        <div className="hero-filter-section">
          <HeroFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onReset={handleResetFilters}
          />
        </div>

        {/* Hero Grid Section */}
        <div className="hero-grid-section">
          {filteredHeroes.length === 0 ? (
            <div className="no-heroes-container">
              <div className="no-heroes-content">
                <div className="no-heroes-icon">🔍</div>
                <h4 className="no-heroes-title">No Heroes Found</h4>
                <p className="no-heroes-text">
                  {searchTerm || selectedRole !== 'All'
                    ? 'Try adjusting your search criteria or filters'
                    : 'No heroes available in the arsenal yet'
                  }
                </p>
                <Button
                  variant="outline-primary"
                  onClick={handleResetFilters}
                  className="reset-filters-btn"
                >
                  🔄 Reset Filters
                </Button>
              </div>
            </div>
          ) : (
            <div className="hero-grid-container">
              <Row className="hero-grid g-4">
                {filteredHeroes.map(hero => (
                  <Col key={hero.id} xl={3} lg={4} md={6} className="hero-col">
                    <HeroCard
                      hero={hero}
                      onSelect={handleSelectHero}
                      onEdit={handleEditHero}
                      onDelete={handleDeleteHero}
                      isAdmin={isAdmin()}
                    />
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </div>

        {/* Hero Modal */}
        <HeroModal
          show={showModal}
          onHide={() => setShowModal(false)}
          hero={selectedHero}
          onSave={handleSaveHero}
          isEdit={isEdit}
        />
      </Container>
    </div>
  );
};

export default MenuPage;
