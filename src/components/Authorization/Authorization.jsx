import React, { useContext, useEffect } from 'react';
import styles from './Authorization.module.scss';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import Admin from '../Admin/Admin';
import axios from 'axios';
import { AuthCTX } from '../../contexts/Auth';

export default function Authorization() {
  const [login, setLogin] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();
  const {isAuth, setIsAuth} = useContext(AuthCTX)
  console.log(isAuth);

  // const onSubmit = (e) => {
  //   const formData = new FormData(e.target);
  //   const formProps = Object.fromEntries(formData);
  //   console.log(formProps);
  // };
  const isValidaton = (e) => {
    e.preventDefault()
    if (login === '' || password === '') {
      alert('Заполните логин и пароль');
      
    }else if (login == '998910130013' && password == 'oxmetal2024') {
        navigate('/admin/control');
        setIsAuth(true)

    }else{
      alert('Неправильный логин или пароль')
    }
  

  };


  return (
    <section className="w-full h-[100vh] flex items-center justify-center">
      <div className={styles.authorization}>
        <h1 className="text-center text-[40px] font-semibold">Авторизация</h1>
        <form action="">
          <input
            type="text"
            onChange={(e) => setLogin(e.target.value)}
            placeholder="Логин"
            required
            value={login}
          />
          <input
            type="text"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
            required
            value={password}
          />

          <div
            onClick={isValidaton}
            className="button ml-[50%] translate-x-[-50%] w-[150px] h-[70px] flex items-center justify-center">
            <button>Войти</button>
          </div>
        </form>
      </div>
   
    </section>
  );
}
