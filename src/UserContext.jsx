import React, { createContext, useState } from 'react';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    username: localStorage.getItem('username') || '',
    lastname: localStorage.getItem('lastname') || '',
    secondLastname: localStorage.getItem('secondlastname') || '',
    email: localStorage.getItem('email') || ''
  });

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('username', userData.username);
    localStorage.setItem('lastname', userData.lastname);
    localStorage.setItem('secondlastname', userData.secondLastname);
    localStorage.setItem('email', userData.email);
  };

  const logoutUser = () => {
    setUser({
      username: '',
      lastname: '',
      secondLastname: '',
      email: ''
    });
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('lastname');
    localStorage.removeItem('secondlastname');
    localStorage.removeItem('email');
  };

  return (
    <UserContext.Provider value={{ user, updateUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
