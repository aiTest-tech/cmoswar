import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginType } from '../types/auth';
import { useLoginMutation } from '../api/registerApi'; // ensure the path is correct

const LoginPage: React.FC = () => {
  const [login, { isLoading, isError, error }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginType) => {
    console.log('Form data submitted:', data);
    try {
      const result = await login(data).unwrap(); // unwrap result to handle response directly
      console.log("Login success:", result);
      localStorage.setItem('accessToken', result.access);
      document.cookie = `refreshToken=${result.refresh}; Secure; HttpOnly; SameSite=Strict`;
      alert('Login successful');
    } catch (err) {
      console.error('Failed to login:', err);
      alert('Login failed, please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center text-gray-700 mb-4">Login</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <input
              type="email"
              {...register('email')}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
            <input
              type="password"
              {...register('password')}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Enter your password"
            />
            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 text-white rounded-lg ${isLoading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
              }`}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
          {isError && (
            <p className="text-sm text-red-500 mt-2 text-center">
              {(error as any)?.data?.message || 'Login failed'}
            </p>
          )}
        </form>
        <p className="text-sm text-center text-gray-500 mt-4">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-500 hover:underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
