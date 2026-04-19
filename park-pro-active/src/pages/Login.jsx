import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, preConfiguredUsers } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      toast.success('Login successful!');
      navigate('/', { replace: true });
    } else {
      toast.error(result.error || 'Login failed');
    }

    setLoading(false);
  };

  const fillCredentials = (user) => {
    setEmail(user.email);
    setPassword(user.password);
    setShowUsers(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 p-4">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <div className="text-center mb-8">
            <img src="/logo.png" alt="Park Pro-Active" className="h-16 w-16 mx-auto mb-4 object-contain" />
            <h1 className="text-2xl font-bold text-gray-900">Park Pro-Active</h1>
            <p className="text-gray-500 mt-1">Engineering Operations Management</p>
          </div>

          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Users must be created in Firebase Console first. 
              See <code className="bg-yellow-100 px-1 rounded">SETUP-FIREBASE-USERS.md</code> for instructions.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6">
            <button
              type="button"
              onClick={() => setShowUsers(!showUsers)}
              className="flex items-center justify-center w-full text-sm text-primary-600 hover:text-primary-700"
            >
              {showUsers ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
              Pre-configured Users
            </button>

            {showUsers && (
              <div className="mt-4 max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                {preConfiguredUsers.map((user, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => fillCredentials(user)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                  >
                    <p className="font-medium text-sm text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${
                      user.role === 'admin' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {user.role}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              Default password for all users: <strong>ParkPro2024!</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
