import { useState } from 'react';

export default function BookDetails() {
  const [editable, setEditable] = useState(false);

  const [data, setData] = useState({
    title: 'Ejemplo de Título',
    author: 'Autor Demo',
    image: 'https://via.placeholder.com/150'
  });

  return (
    <div className="flex gap-6 max-w-3xl mx-auto">
      <img src={data.image} alt={data.title} className="w-48 h-48 object-cover" />
      <div className="flex-1">
        {editable ? (
          <>
            <input className="border p-2 w-full mb-2" value={data.title} onChange={e => setData({ ...data, title: e.target.value })} />
            <input className="border p-2 w-full mb-2" value={data.author} onChange={e => setData({ ...data, author: e.target.value })} />
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold">{data.title}</h2>
            <p className="text-gray-700">{data.author}</p>
          </>
        )}
        <button onClick={() => setEditable(!editable)} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
          {editable ? 'Guardar' : 'Editar'}
        </button>
      </div>
    </div>
  );
}
