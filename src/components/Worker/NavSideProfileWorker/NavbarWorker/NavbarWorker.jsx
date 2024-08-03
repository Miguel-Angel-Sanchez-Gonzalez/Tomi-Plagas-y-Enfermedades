import React, { useState, useEffect, useRef, useContext } from "react";
import { HiMenu } from "react-icons/hi";
import "./NavbarWorker.css"; // Importa el archivo de estilos CSS
import ProfileWorker from '../ProfileWorker/ProfileWorker';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../../UserContext';

const NavbarWorker = ({ onConfigureProfileClick }) => {
  const { user, updateUser, logoutUser } = useContext(UserContext);
  const [showProfileWorker, setshowProfileWorker] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Actualiza el contexto con los datos de localStorage al cargar el componente
    const storedUser = {
      username: localStorage.getItem('username') || '',
      lastname: localStorage.getItem('lastname') || '',
      secondLastname: localStorage.getItem('secondlastname') || '',
      email: localStorage.getItem('email') || ''
    };
    updateUser(storedUser);
  }, []);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const handleProfileFormCancel = () => {
    setshowProfileWorker(false);
  };


  return (
    <div>
      <div className="menu--nav-worker">
        <img src="/images/tomatito.png" alt="" /> {/*Imagen*/}
        <h2>Tomi-Plagas y Enfermedades </h2> {/*Titulo*/}
        <div className="notify-worker" ref={menuRef}>
          <HiMenu className="icon" onClick={toggleMenu} />
          {menuVisible && (
            <div className="menu-options-worker">
              <p onClick={onConfigureProfileClick}>Configurar perfil</p>
              <p onClick={handleLogout}>Cerrar sesión</p>
            </div>
          )}
        </div>
        <div className="user-info-worker">
        <label>{`${user.username} ${user.lastname} ${user.secondLastname}`}</label>
          <br />
          <label>{user.email}</label>
        </div>
      </div>

      {showProfileWorker && <ProfileWorker onCancelClick={handleProfileFormCancel} idWorker={1}/>}
    </div>
  );
};

export default NavbarWorker;
