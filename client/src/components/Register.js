import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './styles.css';

export default function Register() {
  const [email, setEmail] = useState('');
  const [emailMsg, setEmailMsg] = useState('');
  const [password, setPassword] = useState('');
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });
  const [successMsg, setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const emailTimeout = useRef(null);
  const successTimeout = useRef(null);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Vérification en temps réel du mot de passe
  const checkPassword = (pass) => {
    setPasswordChecks({
      length: pass.length >= 8,
      uppercase: /[A-Z]/.test(pass),
      lowercase: /[a-z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[@$!%*?&]/.test(pass)
    });
  };

  const showEmailMsg = (msg, isError = true) => {
    setEmailMsg({ text: msg, isError });
    if (emailTimeout.current) clearTimeout(emailTimeout.current);
    emailTimeout.current = setTimeout(() => setEmailMsg(''), 20000);
  };

  const showSuccessMsg = (msg) => {
    setSuccessMsg(msg);
    if (successTimeout.current) clearTimeout(successTimeout.current);
    successTimeout.current = setTimeout(() => setSuccessMsg(''), 20000);
  };

  const handleEmailBlur = () => {
    if (!email) {
      showEmailMsg("L'email est requis.");
    } else if (!email.includes('@')) {
      showEmailMsg("L'email doit contenir le symbole '@'.");
    } else if (!emailRegex.test(email)) {
      showEmailMsg("Format d'email invalide.");
    } else {
      showEmailMsg("Format d'email valide !", false);
    }
  };

  const isPasswordValid = () => {
    return Object.values(passwordChecks).every(check => check);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailRegex.test(email)) {
      showEmailMsg("Format d'email invalide.");
      return;
    }

    if (!isPasswordValid()) {
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/auth/register', { email, password });
      setEmail('');
      setPassword('');
      showSuccessMsg("✨ Inscription réussie ! Redirection...");
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      showSuccessMsg("Erreur lors de l'inscription. Veuillez réessayer.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Inscription</h2>

      <div className="form-group">
        <input
          type="email"
          value={email}
          onChange={e => {
            setEmail(e.target.value);
            setEmailMsg('');
          }}
          onBlur={handleEmailBlur}
          placeholder="Email"
          required
          className={emailMsg ? (emailMsg.isError ? 'error' : 'valid') : ''}
        />
        {emailMsg && (
          <div className={`alert-message ${emailMsg.isError ? 'error' : 'success'}`}>
            {emailMsg.text}
          </div>
        )}
      </div>

      <div className="form-group password-group">
        <div className="input-eye-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={e => {
              setPassword(e.target.value);
              checkPassword(e.target.value);
            }}
            placeholder="Mot de passe"
            required
            className={isPasswordValid() ? 'valid' : ''}
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
        <div className="password-requirements">
          <div className={`requirement ${passwordChecks.length ? 'met' : ''}`}>
            ✓ Au moins 8 caractères
          </div>
          <div className={`requirement ${passwordChecks.uppercase ? 'met' : ''}`}>
            ✓ Une majuscule
          </div>
          <div className={`requirement ${passwordChecks.lowercase ? 'met' : ''}`}>
            ✓ Une minuscule
          </div>
          <div className={`requirement ${passwordChecks.number ? 'met' : ''}`}>
            ✓ Un chiffre
          </div>
          <div className={`requirement ${passwordChecks.special ? 'met' : ''}`}>
            ✓ Un caractère spécial (@$!%*?&)
          </div>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={!isPasswordValid() || !emailRegex.test(email)}
      >
        Créer un compte
      </button>
      
      {successMsg && <div className="alert-message success">{successMsg}</div>}
    </form>
  );
}