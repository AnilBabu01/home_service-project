import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import BaseLayout from '../../layout/BaseLayout';
import Logo from '../../images/logo/logo.png';
import { useLoginMutation } from '../../redux/api';

const SignIn: React.FC = () => {
  const navigate = useNavigate();

  const [login, { isLoading, isSuccess, isError, error }] = useLoginMutation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData).unwrap();
    } catch (err) {
      console.log('Login failed:', err);
    }
  };

  useEffect(() => {
    const authToken = localStorage.getItem('adminToken');

    if (authToken || isSuccess) {
      navigate('/');
    }
  }, [isSuccess, navigate]);

  return (
    // <BaseLayout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4">

        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

          {/* Logo + Heading */}
          <div className="text-center mb-6">
            <img src={Logo} alt="logo" className="w-50 mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-gray-800">
              Welcome Back 👋
            </h2>
            <p className="text-gray-500 text-sm">
              Sign in to your admin panel
            </p>
          </div>

          {/* Error Message */}
          {isError && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-100 rounded-lg">
              Invalid email or password
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none pr-10"
                  required
                />

                {/* Toggle Password */}
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 cursor-pointer text-gray-500 text-sm"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </span>
              </div>
            </div>

            {/* Remember + Forgot */}
            {/* <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-indigo-500" />
                Remember me
              </label>

              <Link
                to="/forgot-password"
                className="text-indigo-500 hover:underline"
              >
                Forgot?
              </Link>
            </div> */}

            {/* Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center justify-center"
            >
              {isLoading ? (
                <span className="animate-pulse">Signing in...</span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer */}
          {/* <p className="text-center text-sm text-gray-500 mt-6">
            Don’t have an account?{' '}
            <Link
              to="/signup"
              className="text-indigo-600 font-medium hover:underline"
            >
              Sign Up
            </Link>
          </p> */}
        </div>
      </div>
    // </BaseLayout>
  );
};

export default SignIn;