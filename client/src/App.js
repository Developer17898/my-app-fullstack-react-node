import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Register from './components/Register';
import Login from './components/Login';
import BookForm from './components/BookForm';
import BookList from './components/BookList';
import './components/styles.css';

function Navbar({ token, setToken }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
    navigate('/');
  };

  // Afficher Connexion/Inscription sur la page d'accueil, sinon afficher Déconnexion si connecté
  const isHome = location.pathname === '/';

  return (
    <div className="navbar">
      <div>
        <NavLink to="/" className={({ isActive }) => isActive ? "active-link" : ""}>Accueil</NavLink>
      </div>
      <div className="navbar-links">
        {isHome ? (
          <>
            <NavLink to="/login" className={({ isActive }) => isActive ? "active-link" : ""}>Connexion</NavLink>
            <NavLink to="/register" className={({ isActive }) => isActive ? "active-link" : ""}>Inscription</NavLink>
          </>
        ) : (
          token ? (
            <button onClick={handleLogout} className="logout">Déconnexion</button>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => isActive ? "active-link" : ""}>Connexion</NavLink>
              <NavLink to="/register" className={({ isActive }) => isActive ? "active-link" : ""}>Inscription</NavLink>
            </>
          )
        )}
      </div>
    </div>
  );
}

function Accueil() {
  return (
    <div className="home-container">
      <img src="https://www.neh.gov/sites/default/files/2018-06/openbooks.jpg" alt="Accueil" className="home-image" />
    </div>
  );
}

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [booksUpdated, setBooksUpdated] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  const refreshBooks = () => {
    setBooksUpdated(!booksUpdated);
  };

  const handleEditBook = (book) => {
    setSelectedBook(book);
  };

  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        theme="light"
      />
      <Navbar token={token} setToken={setToken} />
      <div className="container">
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/books" element={
            token ? (
              <>
                <BookForm token={token} refresh={refreshBooks} selectedBook={selectedBook} clearEdit={() => setSelectedBook(null)} />
                <BookList token={token} updated={booksUpdated} refresh={refreshBooks} onEdit={handleEditBook} />
              </>
            ) : <Navigate to="/login" />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;