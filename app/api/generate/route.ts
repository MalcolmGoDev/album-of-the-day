import { NextRequest, NextResponse } from 'next/server';

// Word pools for creative generation
const moods = {
  positive: ['golden', 'electric', 'radiant', 'infinite', 'velvet', 'crystal', 'neon', 'cosmic'],
  negative: ['fading', 'hollow', 'grey', 'static', 'distant', 'fractured', 'shadowed', 'drifting'],
  neutral: ['endless', 'parallel', 'analog', 'midnight', 'chrome', 'lunar', 'echo', 'silent'],
};

const nouns = ['hours', 'signals', 'dreams', 'horizons', 'frequencies', 'memories', 'echoes', 'waves', 'nights', 'roads', 'skies', 'cities', 'moments', 'chapters', 'stations'];

const bandPrefixes = ['The', 'Young', 'Last', 'Modern', 'Electric', 'Digital', 'Midnight', 'Lost', 'Wild', 'Silent'];
const bandSuffixes = ['Collective', 'Theory', 'Society', 'Club', 'Experience', 'Movement', 'Project', 'Assembly', 'Alliance', 'Coalition'];
const bandNouns = ['Daydream', 'Satellite', 'Phantom', 'Reverie', 'Mirage', 'Paradox', 'Cascade', 'Vertigo', 'Aurora', 'Nova'];

const genres = [
  'Alternative', 'Indie Rock', 'Electronic', 'Dream Pop', 'Lo-Fi', 
  'Synthwave', 'Post-Rock', 'Ambient', 'Shoegaze', 'Chillwave',
  'Art Pop', 'Neo-Soul', 'Trip-Hop', 'Darkwave', 'Bedroom Pop'
];

const trackVerbs = ['Waiting', 'Running', 'Falling', 'Drifting', 'Burning', 'Floating', 'Chasing', 'Breaking', 'Finding', 'Leaving'];
const trackPrepositions = ['Through', 'Into', 'Beyond', 'After', 'Before', 'Without', 'Against', 'Beneath', 'Above', 'Between'];

function detectMood(text: string): 'positive' | 'negative' | 'neutral' {
  const lower = text.toLowerCase();
  const positiveWords = ['good', 'great', 'happy', 'won', 'success', 'finished', 'completed', 'amazing', 'love', 'fun', 'excited', 'celebrate', 'finally', 'perfect'];
  const negativeWords = ['bad', 'tired', 'exhausted', 'failed', 'boring', 'stuck', 'frustrated', 'annoying', 'stress', 'anxiety', 'sad', 'terrible', 'awful', 'long'];
  
  let positiveCount = positiveWords.filter(w => lower.includes(w)).length;
  let negativeCount = negativeWords.filter(w => lower.includes(w)).length;
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

function extractKeywords(text: string): string[] {
  const words = text.toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 3);
  
  // Remove common words
  const stopWords = ['that', 'this', 'with', 'have', 'from', 'they', 'been', 'were', 'said', 'each', 'which', 'their', 'will', 'would', 'there', 'could', 'other', 'into', 'just', 'very', 'some', 'then', 'than', 'when', 'made', 'back'];
  return words.filter(w => !stopWords.includes(w));
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateAlbumTitle(description: string, mood: 'positive' | 'negative' | 'neutral'): string {
  const keywords = extractKeywords(description);
  const moodWords = moods[mood];
  
  const patterns = [
    () => `${pick(moodWords).charAt(0).toUpperCase() + pick(moodWords).slice(1)} ${pick(nouns).charAt(0).toUpperCase() + pick(nouns).slice(1)}`,
    () => `The ${pick(moodWords).charAt(0).toUpperCase() + pick(moodWords).slice(1)} ${pick(nouns).charAt(0).toUpperCase() + pick(nouns).slice(1)}`,
    () => keywords.length > 0 ? `${keywords[0].charAt(0).toUpperCase() + keywords[0].slice(1)} ${pick(nouns).charAt(0).toUpperCase() + pick(nouns).slice(1)}` : `${pick(moodWords).charAt(0).toUpperCase() + pick(moodWords).slice(1)} Days`,
    () => `${pick(moodWords).charAt(0).toUpperCase() + pick(moodWords).slice(1)} / ${pick(moodWords).charAt(0).toUpperCase() + pick(moodWords).slice(1)}`,
    () => keywords.length > 1 ? `${keywords[0].charAt(0).toUpperCase() + keywords[0].slice(1)} & ${keywords[1].charAt(0).toUpperCase() + keywords[1].slice(1)}` : `${pick(nouns).charAt(0).toUpperCase() + pick(nouns).slice(1)} Vol. ${Math.floor(Math.random() * 3) + 1}`,
  ];
  
  return pick(patterns)();
}

function generateBandName(): string {
  const patterns = [
    () => `${pick(bandPrefixes)} ${pick(bandNouns)}`,
    () => `${pick(bandNouns)} ${pick(bandSuffixes)}`,
    () => `${pick(bandPrefixes)} ${pick(bandNouns)} ${pick(bandSuffixes)}`,
    () => pick(bandNouns),
    () => `${pick(bandNouns)} & The ${pick(bandSuffixes)}`,
  ];
  
  return pick(patterns)();
}

function generateTracks(description: string, mood: 'positive' | 'negative' | 'neutral', count: number = 5): string[] {
  const keywords = extractKeywords(description);
  const moodWords = moods[mood];
  const tracks: string[] = [];
  
  const patterns = [
    () => `${pick(trackVerbs)} ${pick(trackPrepositions)} ${pick(moodWords).charAt(0).toUpperCase() + pick(moodWords).slice(1)} ${pick(nouns).charAt(0).toUpperCase() + pick(nouns).slice(1)}`,
    () => `${pick(moodWords).charAt(0).toUpperCase() + pick(moodWords).slice(1)} ${pick(nouns).charAt(0).toUpperCase() + pick(nouns).slice(1)}`,
    () => keywords.length > 0 ? `${keywords[Math.floor(Math.random() * keywords.length)].charAt(0).toUpperCase() + keywords[Math.floor(Math.random() * keywords.length)].slice(1)}` : pick(nouns).charAt(0).toUpperCase() + pick(nouns).slice(1),
    () => `The ${pick(trackVerbs)} ${pick(nouns).charAt(0).toUpperCase() + pick(nouns).slice(1)}`,
    () => `${pick(moodWords).charAt(0).toUpperCase() + pick(moodWords).slice(1)} (Interlude)`,
    () => `${pick(trackPrepositions)} The ${pick(nouns).charAt(0).toUpperCase() + pick(nouns).slice(1)}`,
  ];
  
  for (let i = 0; i < count; i++) {
    tracks.push(pick(patterns)());
  }
  
  return tracks;
}

function generateImagePrompt(title: string, mood: 'positive' | 'negative' | 'neutral', description: string): string {
  const moodAesthetics = {
    positive: 'warm golden light, vibrant colors, uplifting atmosphere, sunrise, hopeful',
    negative: 'moody blue tones, rain, fog, melancholic, twilight, introspective',
    neutral: 'balanced composition, muted tones, urban landscape, contemplative, minimalist',
  };
  
  const styles = [
    'album cover art style',
    'vinyl record cover aesthetic',
    'retro 80s album artwork',
    'modern minimalist album design',
    'indie rock album cover',
    'dream pop aesthetic',
  ];
  
  return `${pick(styles)}, ${moodAesthetics[mood]}, abstract artistic interpretation of "${description}", cinematic, professional photography, high quality, square format, no text, no words, no letters`;
}

export async function POST(request: NextRequest) {
  try {
    const { description } = await request.json();

    if (!description || typeof description !== 'string') {
      return NextResponse.json({ error: 'Description is required' }, { status: 400 });
    }

    if (description.length > 500) {
      return NextResponse.json({ error: 'Description too long (max 500 characters)' }, { status: 400 });
    }

    // Detect mood from description
    const mood = detectMood(description);
    
    // Generate album metadata
    const title = generateAlbumTitle(description, mood);
    const artist = generateBandName();
    const tracks = generateTracks(description, mood, 5);
    const genre = pick(genres);
    
    // Generate image using Hugging Face Inference API (free)
    const moodStyle = {
      positive: 'warm golden light, vibrant colors, hopeful sunrise',
      negative: 'moody blue tones, rain, melancholic twilight',
      neutral: 'minimalist, muted tones, contemplative urban'
    };
    const imagePrompt = `album cover art, vinyl record aesthetic, ${moodStyle[mood]}, abstract artistic, professional photography, cinematic, no text no words no letters`;
    
    let imageUrl = '';
    
    try {
      // Call Hugging Face Inference API
      const hfResponse = await fetch(
        'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ inputs: imagePrompt }),
        }
      );
      
      if (hfResponse.ok) {
        const blob = await hfResponse.blob();
        const buffer = await blob.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        imageUrl = `data:image/jpeg;base64,${base64}`;
      } else {
        // Fallback to placeholder
        const randomId = Math.floor(Math.random() * 1000);
        imageUrl = `https://picsum.photos/seed/${randomId}/512/512`;
      }
    } catch {
      // Fallback to placeholder
      const randomId = Math.floor(Math.random() * 1000);
      imageUrl = `https://picsum.photos/seed/${randomId}/512/512`;
    }

    return NextResponse.json({
      title,
      artist,
      tracks,
      genre,
      imageUrl,
    });

  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json({ error: 'Failed to generate album' }, { status: 500 });
  }
}
