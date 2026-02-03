'use client';

import { useState } from 'react';

interface AlbumData {
  title: string;
  artist: string;
  tracks: string[];
  imageUrl: string;
  genre: string;
}

export default function Home() {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [album, setAlbum] = useState<AlbumData | null>(null);
  const [error, setError] = useState('');

  async function generateAlbum(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim() || loading) return;

    setLoading(true);
    setError('');
    setAlbum(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: description.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate album');
      }

      setAlbum(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Subtle texture overlay */}
      <div className="fixed inset-0 opacity-[0.015] pointer-events-none" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")'}} />
      
      {/* Header */}
      <header className="pt-16 pb-10 text-center relative">
        <p className="text-amber-500/80 text-sm font-medium tracking-[0.3em] uppercase mb-3">Your Day, Visualized</p>
        <h1 className="text-4xl md:text-5xl font-light tracking-tight text-white">
          Album of the Day
        </h1>
        <div className="mt-4 w-12 h-px bg-amber-500/40 mx-auto" />
      </header>

      <main className="max-w-2xl mx-auto px-6 pb-20 relative">
        {/* Input Form */}
        <form onSubmit={generateAlbum} className="mb-16">
          <div className="relative">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="How was your day? (e.g., 'Long meetings, fixed a tricky bug, rainy afternoon, coffee with an old friend')"
              className="w-full h-28 px-5 py-4 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 resize-none text-base leading-relaxed"
              disabled={loading}
              maxLength={500}
            />
            <div className="absolute bottom-3 right-3 text-neutral-600 text-xs font-mono">
              {description.length}/500
            </div>
          </div>
          <button
            type="submit"
            disabled={loading || !description.trim()}
            className="mt-4 w-full py-3.5 bg-amber-500 text-neutral-900 rounded-lg font-medium hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating...
              </span>
            ) : (
              'Generate Album'
            )}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="mb-8 p-4 bg-red-900/30 border border-red-800/50 rounded-lg text-red-300 text-center text-sm">
            {error}
          </div>
        )}

        {/* Album Cover Result */}
        {album && (
          <div className="animate-fade-in">
            {/* Vinyl Record + Album Cover Container */}
            <div className="max-w-lg mx-auto">
              <div className="relative flex items-center justify-center">
                {/* Vinyl Record (behind album) - showing center label */}
                <div className="absolute right-0 w-[60%] aspect-square translate-x-[45%]">
                  {/* Outer vinyl */}
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-900 via-gray-800 to-black shadow-2xl">
                    {/* Vinyl grooves */}
                    <div className="absolute inset-[3%] rounded-full border border-gray-700/50" />
                    <div className="absolute inset-[8%] rounded-full border border-gray-700/30" />
                    <div className="absolute inset-[15%] rounded-full border border-gray-700/30" />
                    <div className="absolute inset-[22%] rounded-full border border-gray-700/30" />
                    <div className="absolute inset-[30%] rounded-full border border-gray-700/30" />
                    {/* Vinyl shine */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-transparent" />
                    {/* Center label */}
                    <div className="absolute inset-[35%] rounded-full bg-gradient-to-br from-amber-900 via-amber-800 to-amber-950 flex items-center justify-center">
                      <div className="text-center p-2">
                        <div className="w-3 h-3 rounded-full bg-neutral-900 mx-auto mb-1" />
                        <p className="text-[8px] text-amber-200/70 font-medium uppercase tracking-wider truncate max-w-[80px]">
                          {album.artist}
                        </p>
                      </div>
                    </div>
                    {/* Inner ring around label */}
                    <div className="absolute inset-[33%] rounded-full border border-gray-600/50" />
                  </div>
                </div>

                {/* Album Cover (on top) */}
                <div className="relative z-10 w-[75%] bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-1.5 shadow-2xl">
                  {/* Album artwork */}
                  <div className="relative aspect-square rounded overflow-hidden bg-gray-800">
                    <img
                      src={album.imageUrl}
                      alt={`${album.title} album cover`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://picsum.photos/seed/${Date.now()}/512/512`;
                      }}
                    />
                    
                    {/* Overlay with album info */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30">
                      {/* Top - Artist name */}
                      <div className="absolute top-4 left-4 right-4">
                        <p className="text-white/90 text-sm font-medium tracking-widest uppercase">
                          {album.artist}
                        </p>
                      </div>
                      
                      {/* Bottom - Album title only (no genre) */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                          {album.title}
                        </h2>
                      </div>
                    </div>
                  </div>
                  
                  {/* Jewel case shine */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent rounded-lg pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Track List */}
            <div className="mt-12 max-w-md mx-auto">
              <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6">
                {/* Genre tag */}
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-[0.2em]">
                    Tracklist
                  </h3>
                  <span className="px-2.5 py-1 bg-neutral-800 rounded text-neutral-400 text-xs">
                    {album.genre}
                  </span>
                </div>
                <ol className="space-y-2.5">
                  {album.tracks.map((track, i) => (
                    <li key={i} className="flex items-center gap-4 text-neutral-300 text-sm">
                      <span className="text-neutral-600 font-mono text-xs w-5">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="font-light">{track}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Share / Download hint */}
            <div className="mt-8 text-center">
              <p className="text-neutral-600 text-xs">
                Right-click the album to save
              </p>
            </div>
          </div>
        )}

        {/* Example prompt */}
        {!album && !loading && (
          <div className="text-center">
            <p className="text-neutral-600 text-sm">Try something like:</p>
            <p className="mt-3 text-neutral-500 italic text-sm">
              "Rainy morning, three cups of coffee, finished the project at midnight"
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-neutral-600 text-xs tracking-wide space-y-2">
        <p>Built by Malcolm</p>
        <p className="text-neutral-700 max-w-md mx-auto leading-relaxed">
          All album artwork, band names, and track listings are entirely fictional and generated by AI. 
          Any resemblance to actual artists, albums, or songs is purely coincidental.
        </p>
      </footer>
    </div>
  );
}
