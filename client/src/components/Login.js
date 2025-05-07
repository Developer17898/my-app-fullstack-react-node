import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './styles.css';

export default function Login({ setToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const passwordTimeout = useRef(null);

  const showPasswordMsg = (msg) => {
    setPasswordMsg({ text: msg, isError: true });
    if (passwordTimeout.current) clearTimeout(passwordTimeout.current);
    passwordTimeout.current = setTimeout(() => setPasswordMsg(''), 20000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      setToken(res.data.token);
      setEmail('');
      setPassword('');
      setPasswordMsg('');
      navigate('/books');
    } catch (error) {
      if (error.response?.status === 404 || error.response?.status === 401) {
        showPasswordMsg("❌ Email ou mot de passe incorrect");
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Connexion</h2>

      <div className="form-group">
        <input
          type="email"
          value={email}
          onChange={e => {
            setEmail(e.target.value);
            setPasswordMsg('');
          }}
          placeholder="Email"
          required
          className={passwordMsg ? 'error' : ''}
          style={{ height: '44px', fontSize: '1rem' }}
        />
      </div>

      <div className="form-group password-group">
        <div className="input-eye-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={e => {
              setPassword(e.target.value);
              setPasswordMsg('');
            }}
            placeholder="Mot de passe"
            required
            className={passwordMsg ? 'error' : ''}
            style={{ height: '44px', fontSize: '1rem' }}
          />
          <button 
            type="button" 
            className="toggle-password"
            onClick={togglePasswordVisibility}
            tabIndex={-1}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {passwordMsg && (
          <div className="alert-message error">
            {passwordMsg.text}
          </div>
        )}
      </div>

      <button 
        type="submit" 
        disabled={!email || !password}
        className={(!email || !password) ? 'disabled' : ''}
      >
        Se connecter
      </button>
    </form>
  );
}