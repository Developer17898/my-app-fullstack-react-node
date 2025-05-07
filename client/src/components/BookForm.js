import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './styles.css';

export default function BookForm({ token, refresh, selectedBook, clearEdit }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (selectedBook) {
      setTitle(selectedBook.title);
      setAuthor(selectedBook.author);
      setDescription(selectedBook.description);
      setIsEditing(true);
    } else {
      setTitle('');
      setAuthor('');
      setDescription('');
      setIsEditing(false);
    }
  }, [selectedBook]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/books/${selectedBook.id}`, { title, author, description }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("✅ Livre modifié avec succès !", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
        });
      } else {
        await axios.post('http://localhost:5000/api/books', { title, author, description }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("✅ Livre ajouté avec succès !", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
        });
      }
      setTitle('');
      setAuthor('');
      setDescription('');
      setIsEditing(false);
      clearEdit();
      refresh();
    } catch (error) {
      toast.error(error.response?.data?.error || "❌ Erreur lors de l'opération sur le livre.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="book-form">
      <h2>{isEditing ? 'Modifier un livre' : 'Ajouter un livre'}</h2>
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Titre"
        required
      />
      <input
        type="text"
        value={author}
        onChange={e => setAuthor(e.target.value)}
        placeholder="Auteur"
        required
      />
      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Description"
        required
      />
      <button type="submit">{isEditing ? 'Modifier' : 'Ajouter'}</button>
      {isEditing && (
        <button type="button" onClick={() => { setIsEditing(false); clearEdit(); setTitle(''); setAuthor(''); setDescription(''); }}>
          Annuler
        </button>
      )}
    </form>
  );
}