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
  
  for (let i = 0; i < 5; i++) {
    if (i < keywords.length && !usedKeywords.has(keywords[i])) {
      usedKeywords.add(keywords[i]);
      const pattern = trackPatterns[i % trackPatterns.length];
      tracks.push(pattern(keywords[i]));
    } else if (keywords.length > 0) {
      const kw = keywords[Math.floor(Math.random() * keywords.length)];
      const pattern = pick(trackPatterns);
      tracks.push(pattern(kw));
    } else {
      const fallbacks = ['Intro', 'Interlude', 'Outro', 'Track ' + (i + 1), 'Untitled'];
      tracks.push(fallbacks[i]);
    }
  }
  
  return tracks;
}

// Generate a hash from string for consistent randomness
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// Try to generate image via HuggingFace Inference Providers API
async function generateHuggingFaceImage(prompt: string): Promise<string | null> {
  const HF_TOKEN = process.env.HF_TOKEN;
  if (!HF_TOKEN) {
    console.log('No HF_TOKEN configured, falling back to SVG');
    return null;
  }

  // Use HuggingFace's router which routes to inference providers
  // Models available via hf-inference provider
  const models = [
    { name: 'black-forest-labs/FLUX.1-dev', steps: 28, provider: 'hf-inference' },
    { name: 'black-forest-labs/FLUX.1-schnell', steps: 4, provider: 'hf-inference' },
    { name: 'stabilityai/stable-diffusion-xl-base-1.0', steps: 20, provider: 'hf-inference' },
  ];

  for (const model of models) {
    try {
      // Use the new router endpoint
      const response = await fetch(
        `https://router.huggingface.co/hf-inference/models/${model.name}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${HF_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              width: 1024,
              height: 1024,
              num_inference_steps: model.steps,
              guidance_scale: 3.5,
            },
          }),
        }
      );

      if (response.ok) {
        const contentType = response.headers.get('content-type') || '';
        
        // Check if response is an image
        if (contentType.includes('image')) {
          const blob = await response.blob();
          const buffer = Buffer.from(await blob.arrayBuffer());
          const base64 = buffer.toString('base64');
          return `data:${contentType};base64,${base64}`;
        }
        
        // Some providers return JSON with base64 or URL
        const data = await response.json();
        if (data.image) {
          return data.image;
        }
        if (data[0]?.generated_image) {
          return `data:image/png;base64,${data[0].generated_image}`;
        }
      }

      const errorText = await response.text();
      console.log(`HuggingFace ${model.name} failed:`, response.status, errorText);
      
      // If rate limited, model loading, or gone, try next model
      if (response.status === 503 || response.status === 429 || response.status === 410 || response.status === 402) {
        continue;
      }
    } catch (err) {
      console.log(`HuggingFace ${model.name} error:`, err);
    }
  }

  return null;
}

// Generate SVG album art based on description
function generateSvgArt(keywords: string[], mood: 'positive' | 'negative' | 'neutral', description: string): string {
  const hash = hashString(description);
  const rand = (i: number) => ((hash * (i + 1) * 9301 + 49297) % 233280) / 233280;
  
  // Color palettes based on mood
  const palettes = {
    positive: [
      ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3'],
      ['#F8B500', '#FF6F61', '#6B5B95', '#88B04B'],
      ['#FC913A', '#F9D423', '#EDE574', '#E1F5C4'],
    ],
    negative: [
      ['#2C3E50', '#34495E', '#7F8C8D', '#1A1A2E'],
      ['#0F0F0F', '#232323', '#4A4A4A', '#2D132C'],
      ['#1B1B3A', '#2E2E5E', '#4B4B7C', '#6A6A9A'],
    ],
    neutral: [
      ['#E8D5B7', '#B8860B', '#D4A574', '#8B7355'],
      ['#A0A0A0', '#707070', '#505050', '#303030'],
      ['#DDD5D0', '#C9B8A8', '#9A8873', '#6E5E4E'],
    ],
  };
  
  const palette = palettes[mood][Math.floor(rand(0) * palettes[mood].length)];
  const bgColor = palette[0];
  const accentColors = palette.slice(1);
  
  // Generate shapes based on keywords
  let shapes = '';
  const numShapes = 5 + Math.floor(rand(1) * 8);
  
  for (let i = 0; i < numShapes; i++) {
    const color = accentColors[Math.floor(rand(i + 10) * accentColors.length)];
    const opacity = 0.3 + rand(i + 20) * 0.6;
    const shapeType = Math.floor(rand(i + 30) * 4);
    
    if (shapeType === 0) {
      // Circle
      const cx = rand(i + 40) * 512;
      const cy = rand(i + 50) * 512;
      const r = 30 + rand(i + 60) * 150;
      shapes += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" opacity="${opacity}"/>`;
    } else if (shapeType === 1) {
      // Rectangle
      const x = rand(i + 70) * 400;
      const y = rand(i + 80) * 400;
      const w = 50 + rand(i + 90) * 200;
      const h = 50 + rand(i + 100) * 200;
      const rotation = rand(i + 110) * 360;
      shapes += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${color}" opacity="${opacity}" transform="rotate(${rotation} ${x + w/2} ${y + h/2})"/>`;
    } else if (shapeType === 2) {
      // Line/stroke
      const x1 = rand(i + 120) * 512;
      const y1 = rand(i + 130) * 512;
      const x2 = rand(i + 140) * 512;
      const y2 = rand(i + 150) * 512;
      const strokeWidth = 5 + rand(i + 160) * 30;
      shapes += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${strokeWidth}" opacity="${opacity}" stroke-linecap="round"/>`;
    } else {
      // Triangle
      const cx = rand(i + 170) * 512;
      const cy = rand(i + 180) * 512;
      const size = 50 + rand(i + 190) * 150;
      const points = `${cx},${cy - size} ${cx - size * 0.866},${cy + size * 0.5} ${cx + size * 0.866},${cy + size * 0.5}`;
      shapes += `<polygon points="${points}" fill="${color}" opacity="${opacity}"/>`;
    }
  }
  
  // Add some texture/noise overlay
  const noiseId = `noise-${hash}`;
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <defs>
      <filter id="${noiseId}">
        <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" result="noise"/>
        <feColorMatrix type="saturate" values="0"/>
        <feBlend in="SourceGraphic" in2="noise" mode="multiply"/>
      </filter>
      <linearGradient id="grad-${hash}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${accentColors[0]};stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="512" height="512" fill="url(#grad-${hash})"/>
    ${shapes}
    <rect width="512" height="512" fill="transparent" filter="url(#${noiseId})" opacity="0.15"/>
  </svg>`;
  
  // Convert to base64 data URL
  const base64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
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
    
    // Create image prompt from description - make it vivid and specific for album art
    const artStyles = [
      'digital illustration with bold colors and creative typography',
      'surreal dreamlike artwork with vibrant colors',
      'retro vintage aesthetic with modern twist',
      'psychedelic art with swirling patterns and bright colors',
      'minimalist design with striking visual element',
      'collage style mixed media artwork',
      'cinematic landscape with dramatic lighting',
      'pop art inspired bold graphic design',
      'ethereal fantasy illustration',
      'urban street art graffiti style',
    ];
    const artStyle = pick(artStyles);
    
    const moodStyle = mood === 'positive' ? 'vibrant, energetic, warm golden light, celebratory' : 
                      mood === 'negative' ? 'moody, dramatic shadows, deep blues and purples, emotional' : 
                      'dreamy, soft pastels mixed with bold accents, contemplative';
    
    const keywordHints = keywords.slice(0, 3).join(', ');
    const subject = keywordHints || description.slice(0, 50);
    
    const imagePrompt = `Professional music album cover art, ${artStyle}, ${moodStyle}, inspired by: ${subject}. Square format, visually striking, suitable for ${genre} music, high detail, artistic composition, no text or letters`;
    
    // Try HuggingFace AI first, fall back to procedural SVG
    let imageUrl = await generateHuggingFaceImage(imagePrompt);
    const isAiGenerated = imageUrl !== null;
    
    if (!imageUrl) {
      imageUrl = generateSvgArt(keywords, mood, description);
    }

    return NextResponse.json({
      title,
      artist,
      tracks,
      genre,
      imageUrl,
      isAiGenerated, // Let frontend know if it's AI or procedural
    });

  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json({ error: 'Failed to generate album' }, { status: 500 });
  }
}
