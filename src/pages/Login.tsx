// src/pages/Login.tsx

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaApple } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    login,
    googleLogin,
    facebookLogin,
    appleLogin,
    isLoading,
    user
  } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: 'Missing fields', description: 'Please enter both email and password.', variant: 'destructive' });
      return;
    }
    try {
      const success = await login(email, password);
      if (!success) {
        toast({ title: 'Login failed', description: 'Check your credentials.', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Login error occurred.', variant: 'destructive' });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const success = await googleLogin();
      if (!success) {
        toast({ title: 'Google login failed', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Google login error.', variant: 'destructive' });
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const success = await facebookLogin();
      if (success) {
        toast({ title: "Welcome!", description: "Successfully logged in with Facebook." });
      } else {
        toast({ title: "Facebook login failed", description: "Please try again.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "An error occurred during Facebook login.", variant: "destructive" });
    }
  };

  const handleAppleLogin = async () => {
    try {
      const success = await appleLogin();
      if (!success) {
        toast({ title: 'Apple login failed', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Apple login error.', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">velkommen tilbage</h1>
          <p className="text-gray-600">Log ind på din konto for at fortsætte</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-gray-900">Login</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button variant="outline" className="w-full h-12 text-lg gap-2" onClick={handleGoogleLogin} disabled={isLoading}>
                <FcGoogle /> Continue with Google
              </Button>
              <Button variant="outline" className="w-full h-12 text-lg gap-2" onClick={handleFacebookLogin} disabled={isLoading}>
                <FaFacebook className="text-blue-600" /> Continue with Facebook
              </Button>
              <Button variant="outline" className="w-full h-12 text-lg gap-2" onClick={handleAppleLogin} disabled={isLoading}>
                <FaApple /> Continue with Apple
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-12" required />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10 h-12" required />
                  <Button type="button" variant="ghost" size="sm" className="absolute right-2 top-2 h-8 w-8 p-0" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full bg-[#ff00c8] hover:bg-pink-600 h-12 text-lg" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="text-red-600 hover:text-red-700 font-medium">Sign up here</Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
