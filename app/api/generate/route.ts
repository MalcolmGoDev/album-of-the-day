import { NextRequest, NextResponse } from 'next/server';

const genres = [
  'Alternative', 'Indie Rock', 'Electronic', 'Dream Pop', 'Lo-Fi', 
  'Synthwave', 'Post-Rock', 'Ambient', 'Shoegaze', 'Chillwave',
  'Art Pop', 'Neo-Soul', 'Trip-Hop', 'Darkwave', 'Bedroom Pop'
];

const bandPrefixes = ['The', 'Young', 'Modern', 'Electric', 'Digital', 'Midnight', 'Lost', 'Wild', 'Silent', 'Pale', 'Dark', 'Bright', 'New', 'Old'];
const bandNouns = ['Daydream', 'Satellite', 'Phantom', 'Reverie', 'Mirage', 'Paradox', 'Cascade', 'Vertigo', 'Aurora', 'Nova', 'Coast', 'Harbor', 'Weather', 'Radio', 'Cinema', 'Arcade', 'Desert', 'Ocean', 'Mountain', 'River'];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

function extractKeywords(text: string): string[] {
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'is', 'was', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare', 'ought', 'used', 'it', 'its', 'this', 'that', 'these', 'those', 'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'you', 'your', 'he', 'him', 'his', 'she', 'her', 'they', 'them', 'their', 'what', 'which', 'who', 'whom', 'when', 'where', 'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just', 'also', 'now', 'here', 'there', 'then', 'once', 'got', 'get', 'back', 'really', 'finally', 'today', 'yesterday']);
  
  const words = text.toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w));
  
  // Remove duplicates, keep order
  return [...new Set(words)];
}

function detectMood(text: string): 'positive' | 'negative' | 'neutral' {
  const lower = text.toLowerCase();
  const positiveWords = ['good', 'great', 'happy', 'won', 'success', 'finished', 'completed', 'amazing', 'love', 'fun', 'excited', 'celebrate', 'perfect', 'awesome', 'best', 'beautiful', 'wonderful', 'fantastic', 'excellent', 'nice', 'cool', 'chill', 'relax'];
  const negativeWords = ['bad', 'tired', 'exhausted', 'failed', 'boring', 'stuck', 'frustrated', 'annoying', 'stress', 'anxiety', 'sad', 'terrible', 'awful', 'long', 'hard', 'difficult', 'angry', 'upset', 'worried', 'sick', 'pain', 'late', 'missed'];
  
  const positiveCount = positiveWords.filter(w => lower.includes(w)).length;
  const negativeCount = negativeWords.filter(w => lower.includes(w)).length;
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

function generateAlbumTitle(keywords: string[], mood: string): string {
  if (keywords.length === 0) {
    const fallbacks = ['Untitled', 'The Album', 'Chapter One', 'Day One'];
    return pick(fallbacks);
  }
  
  const templates = [
    () => capitalize(keywords[0]),
    () => `The ${capitalize(keywords[0])}`,
    () => keywords.length > 1 ? `${capitalize(keywords[0])} ${capitalize(keywords[1])}` : capitalize(keywords[0]),
    () => `${capitalize(keywords[0])} Days`,
    () => `After ${capitalize(keywords[0])}`,
    () => `${capitalize(keywords[0])} Season`,
    () => keywords.length > 1 ? `${capitalize(keywords[0])} and ${capitalize(keywords[1])}` : `${capitalize(keywords[0])} EP`,
    () => `The ${capitalize(keywords[0])} Tapes`,
    () => `${capitalize(keywords[0])} Hours`,
    () => keywords.length > 2 ? `${capitalize(keywords[0])}, ${capitalize(keywords[1])}, ${capitalize(keywords[2])}` : capitalize(keywords[0]),
  ];
  
  return pick(templates)();
}

function generateBandName(): string {
  const r = Math.random();
  if (r < 0.4) return `${pick(bandPrefixes)} ${pick(bandNouns)}`;
  if (r < 0.7) return pick(bandNouns);
  return `${pick(bandNouns)} ${pick(bandNouns)}`;
}

function generateTracks(keywords: string[], description: string): string[] {
  const tracks: string[] = [];
  const usedKeywords = new Set<string>();
  
  // Make tracks from actual keywords
  const trackPatterns = [
    (kw: string) => capitalize(kw),
    (kw: string) => `The ${capitalize(kw)}`,
    (kw: string) => `${capitalize(kw)} (Reprise)`,
    (kw: string) => `Waiting for ${capitalize(kw)}`,
    (kw: string) => `${capitalize(kw)} Song`,
    (kw: string) => `Late Night ${capitalize(kw)}`,
    (kw: string) => `${capitalize(kw)} Blues`,
    (kw: string) => `${capitalize(kw)} in the Morning`,
    (kw: string) => `${capitalize(kw)} Again`,
    (kw: string) => `Remember ${capitalize(kw)}`,
  ];
  
  // Use keywords for tracks
  for (let i = 0; i < 5; i++) {
    if (i < keywords.length && !usedKeywords.has(keywords[i])) {
      usedKeywords.add(keywords[i]);
      const pattern = trackPatterns[i % trackPatterns.length];
      tracks.push(pattern(keywords[i]));
    } else if (keywords.length > 0) {
      // Reuse a keyword with different pattern
      const kw = keywords[Math.floor(Math.random() * keywords.length)];
      const pattern = pick(trackPatterns);
      tracks.push(pattern(kw));
    } else {
      // Fallback generic tracks
      const fallbacks = ['Intro', 'Interlude', 'Outro', 'Track ' + (i + 1), 'Untitled'];
      tracks.push(fallbacks[i]);
    }
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

    // Extract meaningful content from description
    const keywords = extractKeywords(description);
    const mood = detectMood(description);
    
    // Generate album metadata FROM THE DESCRIPTION
    const title = generateAlbumTitle(keywords, mood);
    const artist = generateBandName();
    const tracks = generateTracks(keywords, description);
    const genre = pick(genres);
    
    // Generate image that MATCHES the description
    const moodColors = {
      positive: 'warm golden bright vibrant sunrise',
      negative: 'dark moody blue rain twilight',
      neutral: 'soft muted calm peaceful serene'
    };
    
    // Use actual keywords in image prompt
    const keywordStr = keywords.slice(0, 3).join(' ');
    const imagePrompt = `album cover art, ${keywordStr}, ${moodColors[mood]}, artistic, abstract, professional, beautiful`;
    const seed = Math.floor(Math.random() * 999999);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?width=512&height=512&seed=${seed}&nologo=true`;

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
