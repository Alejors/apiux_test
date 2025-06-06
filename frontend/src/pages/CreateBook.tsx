import { useState } from 'react';

export default function CreateBook() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [image, setImage] = useState('');

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Crear Libro</h2>
      <form className="flex flex-col gap-3">
        <input className="border p-2" placeholder="Título" value={title} onChange={e => setTitle(e.target.value)} />
        <input className="border p-2" placeholder="Autor" value={author} onChange={e => setAuthor(e.target.value)} />
        <input className="border p-2" placeholder="URL Imagen" value={image} onChange={e => setImage(e.target.value)} />
        <button className="bg-green-600 text-white py-2 rounded">Guardar</button>
      </form>
    </div>
  );
};
