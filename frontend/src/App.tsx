import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
// import Register from './routes/Register';
import Home from './pages/Home';
import CreateBook from './pages/CreateBook';
import BookDetails from './pages/BookDetails';
import ProtectedRoute from './components/protectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <div className="container-fluid h-screen p-4">
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/register" element={<Register />} /> */}
          <Route path="/create" element={<CreateBook />} />
          <Route path="/book/:id" element={<BookDetails />} />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;