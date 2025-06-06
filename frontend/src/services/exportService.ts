import { Notify } from 'notiflix';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api/v1';
export default async function exportCSV() {
    try {
        const response = await fetch(`${API_BASE}/books/export`, {
            credentials: 'include',
        });
        if (!response.ok) {
            Notify.failure('Error al exportar el archivo CSV');
            return
        }

        const filename = `books_export_${new Date().getTime() as string}.csv`;

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        Notify.failure(`Error al exportar: ${error instanceof Error ? error.message : 'Error desconocido'}`)
        console.error(error);
    }
}
