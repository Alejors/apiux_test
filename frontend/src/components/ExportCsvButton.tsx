import exportCSV from '../services/exportService';
import CSVIcon from './CsvIcon';

export default function ExportCsvButton() {
    return (
        <button onClick={() => exportCSV()} className="bg-green-600/80 text-white font-bold px-4 py-2 rounded cursor-pointer">
            <div className="flex"><CSVIcon className="size-6" /><span className="ms-2 font-semibold">Exportar Todos</span>
            </div>
        </button>
    )
}
