// src/pages/Signup.tsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { FaApple } from 'react-icons/fa6';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    signup,
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
    if (!email || !password || !confirmPassword || !name) {
      toast({ title: 'Missing fields', description: 'Please fill in all fields.', variant: 'destructive' });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: 'Password mismatch', description: 'Passwords do not match.', variant: 'destructive' });
      return;
    }

    try {
      const success = await signup(email, password, name);
      if (!success) {
        toast({ title: 'Signup failed', description: 'Try a different email.', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Signup error occurred.', variant: 'destructive' });
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const success = await googleLogin();
      if (!success) {
        toast({ title: 'Google signup failed', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Google signup error.', variant: 'destructive' });
    }
  };

  const handleFacebookSignup = async () => {
    try {
      const success = await facebookLogin();
      if (success) {
        toast({ title: "Welcome!", description: "Successfully signed up with Facebook." });
      } else {
        toast({ title: "Facebook signup failed", description: "Please try again.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "An error occurred during Facebook signup.", variant: "destructive" });
    }
  };

  const handleAppleSignup = async () => {
    try {
      const success = await appleLogin();
      if (!success) {
        toast({ title: 'Apple signup failed', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Apple signup error.', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join ServiceConnect</h1>
          <p className="text-gray-600">Create your account to get started</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-gray-900">Sign Up</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input id="name" type="text" placeholder="Enter your full name" value={name} onChange={(e) => setName(e.target.value)} className="pl-10 h-12" required />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-12" required />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10 h-12" required minLength={6} />
                  <Button type="button" variant="ghost" size="sm" className="absolute right-2 top-2 h-8 w-8 p-0" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pl-10 pr-10 h-12" required />
                  <Button type="button" variant="ghost" size="sm" className="absolute right-2 top-2 h-8 w-8 p-0" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full bg-[#ff00c8] h-12 text-lg" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating account...</span>
                  </div>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="space-y-4 mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              {/* Google */}
              <Button variant="outline" className="w-full h-12 text-lg gap-2" onClick={handleGoogleSignup} disabled={isLoading}>
                <FcGoogle className="h-5 w-5" /> Sign up with Google
              </Button>

              {/* Facebook */}
              <Button variant="outline" className="w-full h-12 text-lg gap-2" onClick={handleFacebookSignup} disabled={isLoading}>
                <FaFacebook className="h-5 w-5 text-[#1877F2]" /> Sign up with Facebook
              </Button>

              {/* Apple */}
              <Button variant="outline" className="w-full h-12 text-lg gap-2" onClick={handleAppleSignup} disabled={isLoading}>
                <FaApple className="h-5 w-5 text-black" /> Sign up with Apple
              </Button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-[#ff00c8] hover:text-red-700 font-medium">Sign in here</Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
