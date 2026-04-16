import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLES = [
  {
    id: 'ceo',
    label: 'CEO',
    desc: 'Full visibility across all tickets & SLA metrics',
    icon: '👑',
    color: 'border-yellow-600/50 hover:border-yellow-500 hover:bg-yellow-900/20',
    activeColor: 'border-yellow-500 bg-yellow-900/25',
    name: 'Eva Thompson',
    avatar: 'ET',
    email: 'eva@company.com',
  },
  {
    id: 'manager',
    label: 'Manager',
    desc: 'Approve, reject, and forward tickets to teams',
    icon: '🗂️',
    color: 'border-blue-600/50 hover:border-blue-500 hover:bg-blue-900/20',
    activeColor: 'border-blue-500 bg-blue-900/25',
    name: 'Carol Smith',
    avatar: 'CS',
    email: 'carol@company.com',
  },
  {
    id: 'employee',
    label: 'Employee',
    desc: 'Submit new tickets and track their progress',
    icon: '👤',
    color: 'border-green-600/50 hover:border-green-500 hover:bg-green-900/20',
    activeColor: 'border-green-500 bg-green-900/25',
    name: 'Alice Johnson',
    avatar: 'AJ',
    email: 'alice@company.com',
  },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!selectedRole) return;
    setLoading(true);
    const role = ROLES.find(r => r.id === selectedRole);
    setTimeout(() => {
      login({
        id: `u-${role.id}`,
        name: role.name,
        role: role.id,
        avatar: role.avatar,
        email: role.email,
      });
      navigate(`/${role.id}-dashboard`);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-orange-800/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 brand-gradient rounded-2xl flex items-center justify-center orange-glow">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-white">
              Support<span className="text-orange-500">Desk</span>
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-gray-400 mt-1 text-sm">Select your role to continue</p>
        </div>

        {/* Role cards */}
        <div className="space-y-3 mb-6">
          {ROLES.map(role => (
            <button
              key={role.id}
              id={`role-${role.id}`}
              onClick={() => setSelectedRole(role.id)}
              className={`w-full text-left p-4 rounded-2xl border bg-gray-900/60 transition-all duration-200 ${
                selectedRole === role.id ? role.activeColor : role.color
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{role.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-white">{role.label}</p>
                    <div className={`w-4 h-4 rounded-full border-2 transition-all ${
                      selectedRole === role.id
                        ? 'border-orange-500 bg-orange-500'
                        : 'border-gray-600'
                    }`} />
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{role.desc}</p>
                  <p className="text-xs text-gray-500 mt-1">Logged in as: <span className="text-gray-300">{role.name}</span></p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Login button */}
        <button
          id="login-btn"
          onClick={handleLogin}
          disabled={!selectedRole || loading}
          className="btn-primary w-full text-center text-base py-3.5"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Signing in…
            </span>
          ) : (
            'Continue →'
          )}
        </button>

        <p className="text-center text-xs text-gray-600 mt-6">
          Demo application — no real authentication
        </p>
      </div>
    </div>
  );
}
