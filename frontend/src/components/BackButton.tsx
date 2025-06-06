import { Link } from "react-router-dom";

export default function BackButton({ location }: string = "") {
    return(
        <Link to={`/${location ? location : ""}`} className="inline-block mb-4">
            <button className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer">Atrás</button>
        </Link>
    )
}

