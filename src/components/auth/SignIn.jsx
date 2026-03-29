import { useState } from 'react';
import { signInWithMagicLink } from '../../lib/auth';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const err = await signInWithMagicLink(email);
    setLoading(false);
    if (err) {
      setError(err.message);
    } else {
      setSent(true);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white tracking-tight">NeuroLeader</h1>
        </div>

        {sent ? (
          <div className="text-center">
            <p className="text-lg text-white font-medium">Check your email</p>
            <p className="text-gray-400 mt-2 text-sm">
              We sent a sign-in link to <span className="text-white">{email}</span>
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-white">Take the Map.</h2>
              <p className="text-gray-400 mt-2">Enter your email to begin.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-indigo-500"
              />
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors disabled:opacity-50"
              >
                {loading ? 'Sending…' : 'Send my link'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
