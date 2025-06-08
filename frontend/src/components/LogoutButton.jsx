import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LogoutButton.css';

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <button className="logout-button" onClick={handleLogout}>
      Cerrar Sesión
    </button>
  );
}

export default LogoutButton;
