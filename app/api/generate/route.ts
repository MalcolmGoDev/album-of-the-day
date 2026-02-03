import { NextRequest, NextResponse } from 'next/server';

// Richer word pools
const adjectives = {
  positive: ['Golden', 'Electric', 'Radiant', 'Infinite', 'Velvet', 'Crystal', 'Neon', 'Cosmic', 'Brilliant', 'Wild', 'Bright', 'Vivid'],
  negative: ['Fading', 'Hollow', 'Grey', 'Static', 'Distant', 'Fractured', 'Shadowed', 'Drifting', 'Lost', 'Broken', 'Empty', 'Cold'],
  neutral: ['Endless', 'Parallel', 'Analog', 'Midnight', 'Chrome', 'Lunar', 'Silent', 'Still', 'Quiet', 'Slow', 'Late', 'Early'],
};

const nouns = ['Hours', 'Signals', 'Dreams', 'Horizons', 'Frequencies', 'Memories', 'Echoes', 'Waves', 'Nights', 'Roads', 'Skies', 'Cities', 'Moments', 'Chapters', 'Stations', 'Waters', 'Mountains', 'Voices', 'Letters', 'Windows', 'Doors', 'Rooms', 'Streets', 'Gardens'];

const albumTitleTemplates = [
  (adj: string, noun: string) => `${adj} ${noun}`,
  (adj: string, noun: string) => `The ${adj} ${noun}`,
  (adj: string, noun: string) => `${noun} in ${adj} Light`,
  (adj: string, noun: string) => `When ${noun} ${adj === 'Lost' ? 'Get Lost' : 'Fall'}`,
  (adj: string, noun: string) => `${adj}`,
  (adj: string, noun: string) => `${noun}`,
  (adj: string, noun: string) => `After the ${noun}`,
  (adj: string, noun: string) => `Before ${adj} ${noun}`,
  (adj: string, noun: string) => `${adj} Season`,
  (adj: string, noun: string) => `The Last ${noun}`,
  (adj: string, noun: string) => `${noun} for the ${adj}`,
  (adj: string, noun: string) => `Everything is ${adj}`,
  (adj: string, noun: string) => `${adj}: Volume I`,
  (adj: string, noun: string) => `${noun} Don't Lie`,
  (adj: string, noun: string) => `How to Be ${adj}`,
];

const bandPrefixes = ['The', 'Young', 'Modern', 'Electric', 'Digital', 'Midnight', 'Lost', 'Wild', 'Silent', 'Pale', 'Dark', 'Bright'];
const bandNouns = ['Daydream', 'Satellite', 'Phantom', 'Reverie', 'Mirage', 'Paradox', 'Cascade', 'Vertigo', 'Aurora', 'Nova', 'Coast', 'Harbor', 'Weather', 'Radio', 'Cinema', 'Arcade'];
const bandSuffixes = ['Collective', 'Theory', 'Society', 'Club', 'Experience', 'Movement', 'Project', 'Assembly', 'Orchestra', 'Ensemble'];

const genres = [
  'Alternative', 'Indie Rock', 'Electronic', 'Dream Pop', 'Lo-Fi', 
  'Synthwave', 'Post-Rock', 'Ambient', 'Shoegaze', 'Chillwave',
  'Art Pop', 'Neo-Soul', 'Trip-Hop', 'Darkwave', 'Bedroom Pop'
];

const trackTemplates = [
  (adj: string, noun: string) => `${adj} ${noun}`,
  (adj: string, noun: string) => `The ${noun}`,
  (adj: string, noun: string) => `Intro: ${adj}`,
  (adj: string, noun: string) => `${noun} (${adj} Mix)`,
  (adj: string, noun: string) => `Waiting for ${noun}`,
  (adj: string, noun: string) => `${adj} Interlude`,
  (adj: string, noun: string) => `Through the ${noun}`,
  (adj: string, noun: string) => `${adj} Again`,
  (adj: string, noun: string) => `Last ${noun}`,
  (adj: string, noun: string) => `${noun} Song`,
  (adj: string, noun: string) => `Outro: ${adj} ${noun}`,
  (adj: string, noun: string) => `2 AM`,
  (adj: string, noun: string) => `${adj} Drive`,
  (adj: string, noun: string) => `${noun} in Motion`,
];

function detectMood(text: string): 'positive' | 'negative' | 'neutral' {
  const lower = text.toLowerCase();
  const positiveWords = ['good', 'great', 'happy', 'won', 'success', 'finished', 'completed', 'amazing', 'love', 'fun', 'excited', 'celebrate', 'finally', 'perfect', 'awesome', 'best'];
  const negativeWords = ['bad', 'tired', 'exhausted', 'failed', 'boring', 'stuck', 'frustrated', 'annoying', 'stress', 'anxiety', 'sad', 'terrible', 'awful', 'long', 'hard', 'difficult'];
  
  const positiveCount = positiveWords.filter(w => lower.includes(w)).length;
  const negativeCount = negativeWords.filter(w => lower.includes(w)).length;
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateAlbumTitle(mood: 'positive' | 'negative' | 'neutral'): string {
  const adj = pick(adjectives[mood]);
  const noun = pick(nouns);
  const template = pick(albumTitleTemplates);
  return template(adj, noun);
}

function generateBandName(): string {
  const r = Math.random();
  if (r < 0.3) return `${pick(bandPrefixes)} ${pick(bandNouns)}`;
  if (r < 0.5) return pick(bandNouns);
  if (r < 0.7) return `${pick(bandNouns)} ${pick(bandSuffixes)}`;
  if (r < 0.85) return `${pick(bandPrefixes)} ${pick(bandNouns)} ${pick(bandSuffixes)}`;
  return `${pick(bandNouns)} & ${pick(bandNouns)}`;
}

function generateTracks(mood: 'positive' | 'negative' | 'neutral', count: number = 5): string[] {
  const tracks: string[] = [];
  const usedTemplates = new Set<number>();
  
  for (let i = 0; i < count; i++) {
    let templateIdx: number;
    do {
      templateIdx = Math.floor(Math.random() * trackTemplates.length);
    } while (usedTemplates.has(templateIdx) && usedTemplates.size < trackTemplates.length);
    usedTemplates.add(templateIdx);
    
    const adj = pick(adjectives[mood]);
    const noun = pick(nouns);
    tracks.push(trackTemplates[templateIdx](adj, noun));
  }
  
  return tracks;
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
    const title = generateAlbumTitle(mood);
    const artist = generateBandName();
    const tracks = generateTracks(mood, 5);
    const genre = pick(genres);
    
    // Generate image using Pollinations with simpler prompt
    const moodStyle = {
      positive: 'warm sunrise golden hour vibrant',
      negative: 'moody rain blue twilight melancholic',
      neutral: 'minimalist urban muted calm'
    };
    
    const styles = ['abstract art', 'oil painting', 'digital art', 'photography', 'illustration', 'surrealism'];
    const imagePrompt = `${pick(styles)}, ${moodStyle[mood]}, album cover, artistic, beautiful composition`;
    const seed = Math.floor(Math.random() * 999999);
    
    // Try Pollinations with enhanced parameter
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?width=512&height=512&seed=${seed}&enhance=true&nologo=true`;

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
