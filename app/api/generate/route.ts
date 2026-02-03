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
  // Evocative standalone titles (used when keywords are weak)
  const standalonePositive = ['Golden Hour', 'Bright Side', 'Wide Awake', 'New Light', 'Full Bloom', 'Good News', 'Rising Tide'];
  const standaloneNegative = ['After Dark', 'Low Light', 'Grey Skies', 'Long Nights', 'Fading Out', 'The Fallout', 'Heavy Weather'];
  const standaloneNeutral = ['In Between', 'Halfway There', 'The Middle', 'On Hold', 'Somewhere', 'Floating', 'Passing Through'];
  
  if (keywords.length === 0) {
    if (mood === 'positive') return pick(standalonePositive);
    if (mood === 'negative') return pick(standaloneNegative);
    return pick(standaloneNeutral);
  }
  
  const kw1 = capitalize(keywords[0]);
  const kw2 = keywords.length > 1 ? capitalize(keywords[1]) : null;
  
  const templates = [
    // Simple but effective
    () => kw1,
    () => `The ${kw1}`,
    () => `${kw1}!`,
    
    // Two-word combinations
    () => kw2 ? `${kw1} ${kw2}` : kw1,
    () => kw2 ? `${kw1} & ${kw2}` : `${kw1} EP`,
    
    // Preposition patterns
    () => `After ${kw1}`,
    () => `Before ${kw1}`,
    () => `Beyond ${kw1}`,
    () => `Into ${kw1}`,
    () => `Without ${kw1}`,
    
    // Time-based
    () => `${kw1} Season`,
    () => `${kw1} Days`,
    () => `The ${kw1} Years`,
    () => `${kw1} at Midnight`,
    
    // Poetic/evocative
    () => `Songs About ${kw1}`,
    () => `Notes on ${kw1}`,
    () => `Letters to ${kw1}`,
    () => `Postcards from ${kw1}`,
    () => `A Study in ${kw1}`,
    
    // Self-titled style
    () => `${kw1} (Deluxe)`,
    () => `The ${kw1} Sessions`,
    () => `${kw1} Tapes`,
    () => `${kw1}, Vol. 1`,
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
  const usedTitles = new Set<string>();
  
  // Evocative words to mix with keywords
  const timeWords = ['Midnight', 'Dawn', 'Dusk', 'Golden Hour', '3 AM', 'Sunday', 'Last Night', 'Tomorrow'];
  const placeWords = ['Downtown', 'Rooftop', 'Highway', 'Coastline', 'Bedroom', 'Backyard', 'Nowhere'];
  const emotionWords = ['Honeyed', 'Bitter', 'Electric', 'Faded', 'Burning', 'Frozen', 'Tender', 'Wild'];
  const actionVerbs = ['Running', 'Falling', 'Drifting', 'Chasing', 'Burning', 'Fading', 'Dreaming', 'Waiting'];
  
  // Different title pattern categories (ensures variety)
  const patternCategories = [
    // One-word evocative titles
    () => pick([...emotionWords, ...actionVerbs, 'Overthinking', 'Dissolve', 'Static', 'Bloom', 'Haze', 'Shimmer', 'Echoes', 'Satellites']),
    
    // Question titles
    (kw: string) => pick([
      `What If ${capitalize(kw)}?`,
      `Where Did ${capitalize(kw)} Go?`,
      `Who Needs ${capitalize(kw)}?`,
      `Why ${capitalize(kw)}?`,
      `Is This ${capitalize(kw)}?`,
      'Are We There Yet?',
      'How Did We Get Here?',
    ]),
    
    // Time + emotion/action
    () => `${pick(timeWords)} ${pick([...emotionWords, ...actionVerbs])}`,
    
    // "The [Adjective] [Noun]" pattern
    (kw: string) => `The ${pick(['Last', 'First', 'Only', 'Same', 'Other', 'Long', 'Short', 'Quiet', 'Loud'])} ${capitalize(kw)}`,
    
    // Place-based titles
    () => `${pick(placeWords)} ${pick(['Dreams', 'Lights', 'Hearts', 'Strangers', 'Silence', 'Thunder', 'Honey'])}`,
    
    // Verb-ing titles
    (kw: string) => `${pick(actionVerbs)} ${pick(['Into', 'Through', 'Away From', 'Toward', 'Without'])} ${capitalize(kw)}`,
    
    // Metaphorical/poetic
    () => pick([
      'Paper Airplanes', 'Glass Houses', 'Silver Linings', 'Broken Clocks',
      'Empty Pockets', 'Heavy Hearts', 'Thin Walls', 'Open Windows',
      'Closed Doors', 'Crooked Smiles', 'Parallel Lines', 'Static Noise',
    ]),
    
    // Number-based titles
    () => pick(['4 AM', 'Track 7', '22', '1000 Miles', 'Exit 49', 'Room 212', 'Year Zero']),
    
    // Opposites/contrasts
    (kw: string) => `${capitalize(kw)} & ${pick(['Dust', 'Shadows', 'Light', 'Fire', 'Ice', 'Silence', 'Thunder'])}`,
    
    // Short phrases
    () => pick([
      'Not Yet', 'Almost There', 'Too Late', 'Right Now', 'One More Time',
      'Start Over', 'Let Go', 'Hold On', 'Come Back', 'Stay Here',
      'Good Enough', 'Never Mind', 'So What', 'Oh Well', 'What Now',
    ]),
  ];
  
  // Shuffle patterns to ensure variety
  const shuffledPatterns = [...patternCategories].sort(() => Math.random() - 0.5);
  
  for (let i = 0; i < 5; i++) {
    const pattern = shuffledPatterns[i % shuffledPatterns.length];
    const kw = keywords[i % Math.max(keywords.length, 1)] || 'love';
    
    let title = pattern(kw);
    
    // Ensure no duplicates
    let attempts = 0;
    while (usedTitles.has(title) && attempts < 10) {
      title = pattern(keywords[Math.floor(Math.random() * Math.max(keywords.length, 1))] || 'time');
      attempts++;
    }
    
    usedTitles.add(title);
    tracks.push(title);
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

  // Models to try - FLUX.1-dev for quality, schnell for speed
  const models = [
    'black-forest-labs/FLUX.1-dev',
    'black-forest-labs/FLUX.1-schnell',
  ];

  for (const model of models) {
    try {
      console.log(`Trying HuggingFace model: ${model}`);
      
      // Use the correct router endpoint for text-to-image
      const response = await fetch(
        `https://router.huggingface.co/hf-inference/models/${model}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${HF_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              negative_prompt: 'oversaturated, HDR, perfect symmetry, smooth skin, lens flare, watermark, text, letters, words, generic, clip art',
              guidance_scale: 7.5,
              num_inference_steps: 30,
            },
          }),
        }
      );

      console.log(`HuggingFace ${model} response status:`, response.status);

      if (response.ok) {
        const contentType = response.headers.get('content-type') || '';
        console.log(`HuggingFace ${model} content-type:`, contentType);
        
        // Check if response is an image
        if (contentType.includes('image')) {
          const blob = await response.blob();
          const buffer = Buffer.from(await blob.arrayBuffer());
          const base64 = buffer.toString('base64');
          console.log(`HuggingFace ${model} SUCCESS - got image`);
          return `data:${contentType};base64,${base64}`;
        }
        
        // Try parsing as JSON (some endpoints return base64 in JSON)
        try {
          const data = await response.json();
          if (data.image) {
            return data.image;
          }
          if (Array.isArray(data) && data[0]?.image) {
            return data[0].image;
          }
        } catch {
          // Not JSON, might be raw bytes
          const buffer = Buffer.from(await response.arrayBuffer());
          const base64 = buffer.toString('base64');
          return `data:image/png;base64,${base64}`;
        }
      }

      const errorText = await response.text();
      console.log(`HuggingFace ${model} failed:`, response.status, errorText.slice(0, 200));
      
      // Continue to next model on certain errors
      if (response.status === 503 || response.status === 429 || response.status === 402 || response.status === 404) {
        continue;
      }
    } catch (err) {
      console.log(`HuggingFace ${model} error:`, err);
    }
  }

  console.log('All HuggingFace models failed, falling back to SVG');
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
    
    // === IMPROVED PROMPT GENERATION (based on album art research) ===
    
    // Artist/designer references by genre category
    const genreArtStyles: Record<string, string[]> = {
      electronic: [
        'Peter Saville meets Bauhaus aesthetic, geometric precision',
        'Warp Records style, abstract digital glitch art',
        '80s synth album aesthetic, neon grid on black void',
        'Berlin techno minimal, stark industrial photography',
      ],
      rock: [
        'Hipgnosis surrealist style, impossible visual metaphor',
        'Storm Thorgerson inspired, conceptual photography',
        'punk zine aesthetic, photocopied and torn edges',
        'grunge era photography, grainy and raw',
      ],
      ambient: [
        '4AD Records ethereal style, Vaughan Oliver inspired',
        'Brian Eno ambient aesthetic, soft gradients and horizons',
        'Japanese minimalism, vast negative space',
        'Rothko-inspired color field, meditative abstraction',
      ],
      hiphop: [
        'bold street photography, dramatic shadows',
        'collage art with vintage magazine cutouts',
        'Def Jam era bold typography and portraits',
        'abstract expressionist with urban elements',
      ],
      indie: [
        'lo-fi Polaroid aesthetic, faded and intimate',
        'hand-drawn illustration with visible imperfections',
        'found photography with cryptic cropping',
        'Sub Pop grunge aesthetic, raw and unpolished',
      ],
      jazz: [
        'Blue Note Records style, high contrast black and white',
        'Reid Miles typography and bold geometry',
        'smokey club photography, single spotlight drama',
        'Impulse Records bold color blocks',
      ],
    };
    
    // Map genre to style category
    const genreCategory = 
      ['Electronic', 'Synthwave', 'Darkwave', 'Chillwave'].includes(genre) ? 'electronic' :
      ['Indie Rock', 'Post-Rock', 'Shoegaze'].includes(genre) ? 'rock' :
      ['Ambient', 'Dream Pop', 'Lo-Fi'].includes(genre) ? 'ambient' :
      ['Trip-Hop', 'Neo-Soul'].includes(genre) ? 'hiphop' :
      ['Alternative', 'Bedroom Pop', 'Art Pop'].includes(genre) ? 'indie' : 'jazz';
    
    const artistStyle = pick(genreArtStyles[genreCategory] || genreArtStyles.indie);
    
    // Imperfection modifiers (adds character, fights AI's "perfect" tendency)
    const imperfections = [
      'visible film grain, slightly faded',
      'subtle print registration errors, vintage feel',
      'high contrast with crushed blacks',
      'muted colors with slight color cast',
      'soft focus edges, sharp center',
      'overexposed highlights, moody',
      'underexposed with rich shadows',
      'cross-processed color shift',
    ];
    const imperfection = pick(imperfections);
    
    // Limited color palettes (constraint creates power)
    const colorPalettes = {
      positive: [
        'warm duotone, orange and teal only',
        'golden hour palette, amber and soft blue',
        'two-tone: coral pink and deep navy',
        'limited palette: yellow ochre, cream, and black',
      ],
      negative: [
        'cold duotone, cyan and black only',
        'monochrome blue with single red accent',
        'desaturated with deep purple shadows',
        'limited palette: charcoal, slate, and bone white',
      ],
      neutral: [
        'sepia duotone with cream highlights',
        'two-tone: sage green and warm grey',
        'muted earth tones only, no pure colors',
        'black and white with single color accent',
      ],
    };
    const colorPalette = pick(colorPalettes[mood]);
    
    // Composition directives (not always centered!)
    const compositions = [
      'asymmetrical composition, subject off-center left',
      'extreme negative space, tiny subject',
      'tight cropped close-up, abstract detail',
      'Dutch angle, tilted perspective',
      'birds eye view, looking down',
      'horizon line at very top of frame',
      'subject partially cropped at edge',
      'layered depth, foreground blur',
    ];
    const composition = pick(compositions);
    
    // Conceptual tension (pair opposites for memorability)
    const tensionConcepts = [
      'beauty in decay',
      'stillness amid chaos',
      'familiar made strange',
      'intimate yet distant',
      'nature reclaiming technology',
      'solitude in a crowd',
      'warmth in cold spaces',
      'order emerging from entropy',
    ];
    const tension = pick(tensionConcepts);
    
    // Build the subject from keywords with conceptual depth
    const keywordHints = keywords.slice(0, 3).join(', ');
    const subject = keywordHints || description.slice(0, 50);
    
    // Construct the prompt with all elements
    const imagePrompt = `Album cover art. ${artistStyle}. ${composition}. Theme: ${subject}, conveying ${tension}. ${colorPalette}. ${imperfection}. Square format, no text, no letters, no words, no titles. Artistic, evocative, memorable.`;
    
    // Log the prompt for debugging
    console.log('Generated art prompt:', imagePrompt);
    
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
