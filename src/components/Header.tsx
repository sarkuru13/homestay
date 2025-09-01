import { Link, useNavigate } from 'react-router-dom';
import { Home, LogOut, Settings, Store } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Home className="h-8 w-8 text-emerald-600" />
            <span className="text-xl font-bold text-gray-900">
              Karbi Anglong Stays
            </span>
          </Link>

          <nav className="flex items-center gap-4">
            <Link
              to="/"
              className="text-gray-700 hover:text-emerald-600 transition-colors"
            >
              Home
            </Link>
            
            {user ? (
              <>
                <Link
                  to="/admin"
                  className="flex items-center gap-1 text-gray-700 hover:text-emerald-600 transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  Admin
                </Link>
                <Link
                  to="/vendor"
                  className="flex items-center gap-1 text-gray-700 hover:text-emerald-600 transition-colors"
                >
                  <Store className="h-4 w-4" />
                  Vendor
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1 text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}