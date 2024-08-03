import React, { useState, useEffect, useRef, useContext } from 'react';
import { HiMenu } from "react-icons/hi";
import './NavbarFarmer.css';
import ProfileFarmer from '../ProfileFarmer/ProfileFarmer';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../../UserContext';

const NavbarFarmer = ({ onConfigureProfileClick }) => {
  const { user, updateUser, logoutUser } = useContext(UserContext);
  const [showProfileFarmer, setShowProfileFarmer] = useState(false);
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
    setShowProfileFarmer(false);
  };

  return (
    <div>
      <div className='menu--nav-farmer'>
        <img src="/images/tomatito.png" alt="" /> {/*Imagen*/}
        <h2>Tomi-Plagas y Enfermedades </h2> {/*Titulo*/}
        <div className='notify-farmer' ref={menuRef}>
          <HiMenu className='icon' onClick={toggleMenu} />
          {menuVisible && (
            <div className="menu-options-farmer">
              <p onClick={onConfigureProfileClick}>Configurar perfil</p>
              <p onClick={handleLogout}>Cerrar sesión</p>
            </div>
          )}
        </div>
        <div className='user-info-farmer'>
          <label>{`${user.username} ${user.lastname} ${user.secondLastname}`}</label>
          <br />
          <label>{user.email}</label>
        </div>
      </div>

      {showProfileFarmer && <ProfileFarmer onCancelClick={handleProfileFormCancel} />}
    </div>
  );
};

export default NavbarFarmer;
