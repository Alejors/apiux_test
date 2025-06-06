import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
// import Register from './routes/Register';
import Home from './pages/Home';
import CreateBook from './pages/CreateBook';
import BookDetails from './pages/BookDetails';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <main className="px-4">
      <section className="w-full lg:w-[740px] mx-auto">
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            {/* <Route path="/register" element={<Register />} /> */}
            <Route path="/create" element={<CreateBook />} />
            <Route path="/book/:id" element={<BookDetails />} />
          </Routes>
        </AuthProvider>
      </section>
    </main>
  );
}

export default App;