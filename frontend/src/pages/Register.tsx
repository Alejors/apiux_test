import { z } from 'zod';
import Notiflix from 'notiflix';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

import { signup } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import BackButton from '../components/BackButton';

const schema = z.object({
  name: z.string().min(1, { message: 'El nombre es obligatorio' }),
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
});

type RegisterFormData = z.infer<typeof schema>;

export default function Register() {
  const { setIsAuthenticated, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await signup(data.name, data.email, data.password);
      console.log(response);
      Notiflix.Notify.success('Registrado Exitosamente!');
      navigate('/login');
    } catch (error) {
      Notiflix.Notify.failure(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsAuthenticated(false);
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
        <h2 className="text-2xl font-bold mb-4 text-center">Crea tu Cuenta</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 mb-5">
          <div>
            <input
              {...register('name')}
              className="border p-2 bg-white/10 rounded w-full"
              placeholder="Juan Pérez"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>
          <div>
            <input
              {...register('email')}
              className="border p-2 bg-white/10 rounded w-full"
              placeholder="tucorreo@email.com"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
          <div>
            <input
              type="password"
              {...register('password')}
              className="border p-2 bg-white/10 rounded w-full"
              title="La contraseña debe tener al menos 6 caracteres"
              minLength={6}
              placeholder="contraseña..."
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>
          <button className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 cursor-pointer">Registrarse</button>
        </form>
        <BackButton location="login" />
      </div>
    </div>
  );
}