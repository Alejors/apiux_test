import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import type { Book } from '../types';

const columnHelper = createColumnHelper<Book>();

const columns = [
  columnHelper.accessor('image_url', {
    header: 'Portada',
    cell: info => (
      <img
        src={info.getValue() ? info.getValue() : "https://placehold.co/400"}
        alt="Portada"
        className="w-16 h-24 object-cover rounded"
      />
    ),
  }),
  columnHelper.accessor('title', {
    header: 'Título',
  }),
  columnHelper.accessor('author', {
    header: 'Autor',
  }),
  columnHelper.accessor('editorial', {
    header: 'Editorial',
  }),
  columnHelper.accessor('genre', {
    header: 'Género',
  }),
  columnHelper.accessor('price', {
    header: 'Precio',
    cell: info => `$${info.getValue()}`,
  }),
  columnHelper.accessor('availability', {
    header: 'Stock',
    cell: info => (
      <span className={info.getValue() ? 'text-green-600' : 'text-red-600'}>
        {info.getValue() ? 'Disponible' : 'Agotado'}
      </span>
    ),
  }),
  columnHelper.accessor('id', {
    header: 'Acciones',
    cell: info => (
      <Link
        to={`/book/${info.getValue()}`}
        className="text-blue-500 hover:underline"
      >
        <button className="bg-blue-500 text-white px-4 py-2 rounded cursor-zoom-in">Ver</button>
      </Link>
    ),
  }),
];

export default function BooksTable({ data }: { data: Book[] }) {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="p-4">
      <input
        className="mb-4 border bg-white/20 p-2 rounded w-full md:w-1/3"
        placeholder="Buscar..."
        value={globalFilter}
        onChange={e => setGlobalFilter(e.target.value)}
      />
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="bg-black/80">
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="p-2 border cursor-pointer select-none"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() === 'asc'
                      ? ' 🔼'
                      : header.column.getIsSorted() === 'desc'
                      ? ' 🔽'
                      : ''}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="border-b hover:bg-blue-500/50 hover:font-semibold text-center">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="p-2 border">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}