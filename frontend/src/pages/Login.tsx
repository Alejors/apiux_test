import { z } from 'zod';
import Notiflix from 'notiflix';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

import { login } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const schema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string(),
});
// .min(6, { message: 'Mínimo 6 caracteres' })
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
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div>
            <input
              {...register('email')}
              className="border p-2 bg-white/10 rounded w-full"
              placeholder="Email"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div>
            <input
              type="password"
              {...register('password')}
              className="border p-2 rounded w-full"
              placeholder="Password"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          <button className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Login</button>
        </form>
      </div>
    </div>
  );
}