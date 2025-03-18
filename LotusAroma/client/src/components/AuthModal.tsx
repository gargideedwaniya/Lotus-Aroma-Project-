import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

// Form schemas
const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const { toast } = useToast();

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    }
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
    }
  });

  // Handle login
  const handleLogin = async (data: LoginFormValues) => {
    try {
      const response = await apiRequest('POST', '/api/auth/login', data);
      
      if (!response.ok) {
        const errorData = await response.json();
        toast({
          title: 'Login Failed',
          description: errorData.message || 'Invalid credentials',
          variant: 'destructive',
        });
        return;
      }
      
      const userData = await response.json();
      toast({
        title: 'Login Successful',
        description: `Welcome back, ${userData.username}!`,
      });
      
      onClose();
      window.location.reload(); // Refresh to update auth state
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Handle register
  const handleRegister = async (data: RegisterFormValues) => {
    try {
      const { confirmPassword, ...registerData } = data;
      
      const response = await apiRequest('POST', '/api/auth/register', registerData);
      
      if (!response.ok) {
        const errorData = await response.json();
        toast({
          title: 'Registration Failed',
          description: errorData.message || 'Could not create account',
          variant: 'destructive',
        });
        return;
      }
      
      const userData = await response.json();
      toast({
        title: 'Registration Successful',
        description: `Welcome, ${userData.username}!`,
      });
      
      onClose();
      window.location.reload(); // Refresh to update auth state
    } catch (error) {
      toast({
        title: 'Registration Failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Close modal when clicking outside
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOutsideClick}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition-colors"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 font-medium ${
              mode === 'login' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-gray-500 hover:text-gray-800'
            }`}
            onClick={() => setMode('login')}
          >
            Sign In
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              mode === 'register' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-gray-500 hover:text-gray-800'
            }`}
            onClick={() => setMode('register')}
          >
            Create Account
          </button>
        </div>

        {/* Login Form */}
        {mode === 'login' && (
          <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
            <div>
              <label htmlFor="login-username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="login-username"
                type="text"
                {...loginForm.register('username')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              {loginForm.formState.errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {loginForm.formState.errors.username.message}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                {...loginForm.register('password')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              {loginForm.formState.errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {loginForm.formState.errors.password.message}
                </p>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              
              <div className="text-sm">
                <a href="#" className="font-medium text-primary hover:text-primary/80">
                  Forgot password?
                </a>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loginForm.formState.isSubmitting}
              className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
            >
              {loginForm.formState.isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        )}

        {/* Register Form */}
        {mode === 'register' && (
          <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
            <div>
              <label htmlFor="register-username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="register-username"
                type="text"
                {...registerForm.register('username')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              {registerForm.formState.errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {registerForm.formState.errors.username.message}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="register-password"
                type="password"
                {...registerForm.register('password')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              {registerForm.formState.errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {registerForm.formState.errors.password.message}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="register-confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                id="register-confirm-password"
                type="password"
                {...registerForm.register('confirmPassword')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              {registerForm.formState.errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {registerForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>
            
            <div className="flex items-center">
              <input
                id="terms"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I agree to the <a href="#" className="text-primary hover:text-primary/80">Terms of Service</a> and <a href="#" className="text-primary hover:text-primary/80">Privacy Policy</a>
              </label>
            </div>
            
            <button
              type="submit"
              disabled={registerForm.formState.isSubmitting}
              className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
            >
              {registerForm.formState.isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        )}

        {/* Social Login */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <i className="fab fa-google text-red-500 mr-2"></i>
              Google
            </button>
            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <i className="fab fa-facebook text-blue-600 mr-2"></i>
              Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;