import { z } from 'zod';
import Notiflix from 'notiflix';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

import { login } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const schema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string(),
});

type LoginFormData = z.infer<typeof schema>;


export default function Login() {
  const { setIsAuthenticated, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      Notiflix.Notify.success('Login Exitoso!');
      setIsAuthenticated(true);
      navigate('/');
    } catch (error) {
      Notiflix.Notify.failure(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="w-full max-w-md p-6 bg-black/20 border rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-center">Inicia Sesión</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div>
            <input
              {...register('email')}
              className="border p-2 bg-white/10 rounded w-full"
              placeholder="tucorreo@email.com..."
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div>
            <input
              type="password"
              {...register('password')}
              className="border p-2 bg-white/10 rounded w-full"
              placeholder="Contraseña..."
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          <button className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 cursor-pointer">Inica Sesión</button>
        </form>
        <p className="text-center text-sm mt-4">
          ¿No tienes cuenta? <Link to="/register" className="text-blue-500 hover:underline">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
}