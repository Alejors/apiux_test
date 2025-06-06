import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="max-w-md mx-auto lg:max-w-[1440px] bg-white/90">
      <h2 className="flex justify-center text-2xl text-black font-bold mb-4">Hello World!</h2>
    </div>
  );
};

export default Home;
