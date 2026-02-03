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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Header */}
      <header className="pt-12 pb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
          Album of the Day
        </h1>
        <p className="mt-3 text-gray-400 text-lg">
          Turn your day into an album cover
        </p>
      </header>

      <main className="max-w-4xl mx-auto px-4 pb-16">
        {/* Input Form */}
        <form onSubmit={generateAlbum} className="mb-12">
          <div className="relative">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your day in a few words... (e.g., 'Back-to-back meetings, finally fixed that bug, pizza for dinner')"
              className="w-full h-32 px-5 py-4 bg-white/10 backdrop-blur border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-lg"
              disabled={loading}
              maxLength={500}
            />
            <div className="absolute bottom-3 right-3 text-gray-500 text-sm">
              {description.length}/500
            </div>
          </div>
          <button
            type="submit"
            disabled={loading || !description.trim()}
            className="mt-4 w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-lg hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-purple-500/25"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating your album...
              </span>
            ) : (
              '🎨 Generate Album Cover'
            )}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="mb-8 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-center">
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
                <div className="absolute right-0 w-[80%] aspect-square translate-x-[22%]">
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
                    <div className="absolute inset-[35%] rounded-full bg-gradient-to-br from-purple-900 via-purple-800 to-purple-950 flex items-center justify-center">
                      <div className="text-center p-2">
                        <div className="w-3 h-3 rounded-full bg-gray-900 mx-auto mb-1" />
                        <p className="text-[8px] text-purple-300/80 font-medium uppercase tracking-wider truncate max-w-[80px]">
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
            <div className="mt-10 max-w-md mx-auto">
              <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6">
                {/* Genre tag */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Track List
                  </h3>
                  <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-xs font-medium">
                    {album.genre}
                  </span>
                </div>
                <ol className="space-y-2">
                  {album.tracks.map((track, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-200">
                      <span className="text-purple-400 font-mono text-sm w-6">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span>{track}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Share / Download hint */}
            <div className="mt-8 text-center">
              <p className="text-gray-500 text-sm">
                Right-click the image to save your album cover
              </p>
            </div>
          </div>
        )}

        {/* Example prompt */}
        {!album && !loading && (
          <div className="text-center text-gray-500">
            <p className="text-sm">Try something like:</p>
            <p className="mt-2 text-gray-400 italic">
              "Rainy morning, three cups of coffee, finished the project at midnight"
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 py-4 text-center text-gray-600 text-sm bg-gradient-to-t from-gray-900 to-transparent">
        Made with 🎵 by Marvin
      </footer>
    </div>
  );
}
