import { useState } from 'react';
import { Store, CreditCard, Users, Disc3, ExternalLink } from 'lucide-react';
import { supabase } from './lib/supabase';

function App() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const { error } = await supabase
        .from('waitlist')
        .insert([{ email }]);

      if (error) {
        if (error.code === '23505') {
          setStatus('error');
          setMessage('This email is already on the waitlist.');
        } else {
          throw error;
        }
      } else {
        setStatus('success');
        setMessage('Welcome to the future of music! You\'re on the list.');
        setEmail('');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-950/20 via-zinc-950 to-amber-950/20"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>

      <div className="relative z-10">
        {/* FIXED NAVIGATION BLOCK BELOW */}
        <nav className="container mx-auto px-6 py-8 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img 
              src="/logo.png" 
              alt="Sovan Logo" 
              className="w-10 h-10 object-contain shadow-lg shadow-orange-900/20" 
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent">
              SOVAN
            </span>
          </div>
          <div className="text-sm text-zinc-500 flex items-center space-x-2">
            <div className="w-2 h-2 bg-orange-600 rounded-full animate-pulse"></div>
            <span>Launching Soon</span>
          </div>
        </nav>

        <main className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <div className="inline-block mb-6 px-4 py-2 bg-orange-950/30 border border-orange-800/30 rounded-full text-orange-500 text-sm font-medium backdrop-blur-sm">
              Commerce Engine for Indie Artists
            </div>

            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-zinc-100 via-orange-100 to-zinc-300 bg-clip-text text-transparent">
                Sell Direct.
              </span>
              <br />
              <span className="bg-gradient-to-r from-orange-500 via-orange-400 to-amber-500 bg-clip-text text-transparent">
                Keep 90%.
              </span>
            </h1>

            <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              The commerce platform that lets indie artists sell music and merch directly to fans.
              Digital downloads, physical drops, local payments — one engine, your rules.
            </p>

            <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={status === 'loading'}
                  className="flex-1 px-6 py-4 bg-zinc-900/50 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent text-zinc-100 placeholder-zinc-500 backdrop-blur-sm disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 text-white font-semibold rounded-lg shadow-lg shadow-orange-900/50 transition-all duration-200 hover:shadow-orange-900/70 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {status === 'loading' ? 'Joining...' : 'Join Waitlist'}
                </button>
              </div>
              {message && (
                <p className={`mt-4 text-sm ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                  {message}
                </p>
              )}
            </form>

            <p className="text-xs text-zinc-600">
              Join thousands of artists reclaiming their creative freedom
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="group relative bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/50 rounded-2xl p-8 hover:border-orange-800/50 transition-all duration-300 hover:shadow-xl hover:shadow-orange-950/20">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-950/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-600/20 to-orange-800/20 rounded-xl flex items-center justify-center mb-6 border border-orange-700/30">
                  <Store className="w-7 h-7 text-orange-500" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-zinc-100">Your Storefront</h3>
                <p className="text-zinc-400 leading-relaxed mb-4">
                  Set up in minutes. Upload your music, set your price, and start selling. Digital downloads and physical merch — vinyl, cassettes, CDs — all in one place.
                </p>
                <ul className="space-y-2 text-sm text-zinc-500">
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">•</span>
                    <span>Upload MP3, FLAC, WAV — we handle delivery</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">•</span>
                    <span>Name-your-price or fixed — you decide</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">•</span>
                    <span>Physical drops with artist-managed shipping</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="group relative bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/50 rounded-2xl p-8 hover:border-orange-800/50 transition-all duration-300 hover:shadow-xl hover:shadow-orange-950/20">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-950/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-600/20 to-orange-800/20 rounded-xl flex items-center justify-center mb-6 border border-orange-700/30">
                  <CreditCard className="w-7 h-7 text-orange-500" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-zinc-100">Local Payments</h3>
                <p className="text-zinc-400 leading-relaxed mb-4">
                  Built for Southeast Asia. Fans pay with DuitNow QR, FPX, Touch 'n Go, GrabPay, and cards — not just PayPal and credit cards.
                </p>
                <ul className="space-y-2 text-sm text-zinc-500">
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">•</span>
                    <span>10% flat platform fee — you keep 90%</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">•</span>
                    <span>Same-day payout to your bank account</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">•</span>
                    <span>No monthly fees, no hidden charges</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-20 text-center">
            <div className="inline-flex items-center space-x-2 text-zinc-500">
              <Users className="w-5 h-5" />
              <span className="text-sm">Built for indie artists, starting in Malaysia</span>
            </div>

            <div className="mt-8 max-w-lg mx-auto p-6 bg-zinc-900/30 border border-zinc-800/50 rounded-xl backdrop-blur-sm">
              <p className="text-sm text-zinc-400 mb-3">
                <span className="text-orange-400 font-semibold">Live case study:</span> Kasetape — a SEA indie culture brand — runs its cassette drops on Sovan.
              </p>
              <a href="https://kasetape.com" className="inline-flex items-center text-sm text-orange-400 hover:text-orange-300 transition-colors">
                See it on Kasetape <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>

            <div className="mt-12 flex justify-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/50 flex items-center justify-center shadow-2xl shadow-orange-950/30">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-600/30 to-amber-600/20 flex items-center justify-center">
                    <Disc3 className="w-10 h-10 text-orange-400 animate-spin" style={{ animationDuration: '8s' }} />
                  </div>
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-orange-600/10 via-amber-500/5 to-orange-600/10 rounded-full blur-xl"></div>
              </div>
            </div>
          </div>
        </main>

        <footer className="container mx-auto px-6 py-8 border-t border-zinc-900 mt-20">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-zinc-600">
            <div className="mb-4 md:mb-0">
              © 2026 Sovan. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a href="https://sovan.app/privacy" className="hover:text-orange-500 transition-colors">Privacy</a>
              <a href="https://sovan.app/terms" className="hover:text-orange-500 transition-colors">Terms</a>
              <a href="mailto:hello@sovan.app" className="hover:text-orange-500 transition-colors">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;