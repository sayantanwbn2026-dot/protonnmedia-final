export interface CaseStudy {
  id: string;
  step: string;
  project: string;
  client: string;
  image: string;
  heroVideo?: string;
  description: string;
  outcome: string;
  year: string;
  duration: string;
  team: { role: string; name: string }[];
  overview: string;
  challenge: string;
  solution: string;
  behindTheScenes: {
    title: string;
    description: string;
    image: string;
  }[];
  videos: {
    title: string;
    url: string;
    thumbnail: string;
  }[];
  stats: { label: string; value: string }[];
  awards?: string[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
}

export const caseStudies: CaseStudy[] = [
  {
    id: 'ethereal-dreams',
    step: 'Ideation',
    project: 'Ethereal Dreams',
    client: 'Lumina Cosmetics',
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&q=80',
    heroVideo: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Brainstormed 47 concepts before landing on the perfect visual metaphor—liquid gold transforming into organic beauty.',
    outcome: '12M+ views in first week',
    year: '2024',
    duration: '8 weeks',
    team: [
      { role: 'Director', name: 'Marcus Chen' },
      { role: 'Creative Lead', name: 'Sofia Rodriguez' },
      { role: 'Cinematographer', name: 'James Wright' },
      { role: 'VFX Supervisor', name: 'Elena Petrova' },
    ],
    overview: 'Lumina Cosmetics approached us with a challenge: create a campaign that would redefine luxury beauty advertising. They wanted something that felt otherworldly yet deeply human—a visual poem that would resonate with their audience on an emotional level.',
    challenge: 'The beauty industry is saturated with similar aesthetics. Our challenge was to create something genuinely unique while maintaining the premium feel that Lumina\'s brand demands. We needed to visualize the transformation that their products promise without falling into clichéd before-and-after tropes.',
    solution: 'We developed the concept of "Ethereal Dreams"—a visual journey where liquid gold becomes the metaphor for inner radiance. Through extensive ideation sessions, we explored 47 different concepts before landing on our final vision: a dreamscape where beauty emerges organically from pure light.',
    behindTheScenes: [
      {
        title: 'Concept Development',
        description: 'Our creative team spent two weeks in intensive brainstorming sessions, filling walls with mood boards, sketches, and visual references from fine art to nature photography.',
        image: 'https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=800&q=80',
      },
      {
        title: 'Visual R&D',
        description: 'We created over 200 test renders to perfect the liquid gold simulation, working closely with our VFX team to achieve the exact viscosity and light interaction we envisioned.',
        image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80',
      },
      {
        title: 'Client Collaboration',
        description: 'Weekly deep-dive sessions with the Lumina team ensured our creative vision aligned perfectly with their brand values and campaign objectives.',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
      },
    ],
    videos: [
      {
        title: 'Final Campaign Film',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&q=80',
      },
      {
        title: 'Making Of Documentary',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&q=80',
      },
    ],
    stats: [
      { label: 'Concepts Explored', value: '47' },
      { label: 'Views First Week', value: '12M+' },
      { label: 'Engagement Rate', value: '8.4%' },
      { label: 'Brand Recall', value: '+340%' },
    ],
    awards: ['Cannes Lions Gold', 'D&AD Pencil', 'One Show Merit'],
    testimonial: {
      quote: 'ProtoNN didn\'t just create an ad—they created art that perfectly captures what Lumina stands for. The ideation process was extraordinary.',
      author: 'Isabella Martinez',
      role: 'CMO, Lumina Cosmetics',
    },
  },
  {
    id: 'the-last-mile',
    step: 'Scripting',
    project: 'The Last Mile',
    client: 'Atlas Logistics',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&q=80',
    heroVideo: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Crafted a narrative following a single package across continents, weaving human stories into supply chain poetry.',
    outcome: 'Cannes Lions Bronze',
    year: '2024',
    duration: '12 weeks',
    team: [
      { role: 'Director', name: 'Sarah Kim' },
      { role: 'Lead Writer', name: 'Michael Torres' },
      { role: 'Story Editor', name: 'Anna Bergström' },
      { role: 'Research Lead', name: 'David Okonkwo' },
    ],
    overview: 'Atlas Logistics wanted to humanize their brand—to show that behind every delivery is a story worth telling. We were tasked with creating a narrative that would transform the perception of logistics from a faceless industry to a deeply human endeavor.',
    challenge: 'Logistics isn\'t exactly the most emotionally engaging subject. The challenge was to find the poetry in package delivery, to discover the human stories hidden within the supply chain without being sentimental or losing the brand\'s professional credibility.',
    solution: 'We developed "The Last Mile"—a cinematic journey following a single package from a small artisan workshop in Portugal to a grandmother\'s doorstep in Japan. Each leg of the journey reveals the humans who make global commerce possible: the night-shift warehouse worker, the pilot navigating storms, the delivery driver who remembers every customer by name.',
    behindTheScenes: [
      {
        title: 'Deep Research Phase',
        description: 'Our writers spent three weeks embedded within Atlas\'s operations, interviewing over 50 employees across the supply chain to gather authentic stories.',
        image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&q=80',
      },
      {
        title: 'Script Development',
        description: 'We wrote 12 different versions of the script, each exploring different perspectives and narrative structures before finding the perfect voice.',
        image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80',
      },
      {
        title: 'Table Reads',
        description: 'Professional actors helped us refine dialogue through multiple table reads, ensuring every word felt authentic and emotionally resonant.',
        image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80',
      },
    ],
    videos: [
      {
        title: 'The Last Mile - Full Film',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&q=80',
      },
      {
        title: 'Director\'s Commentary',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&q=80',
      },
    ],
    stats: [
      { label: 'Script Versions', value: '12' },
      { label: 'Interviews Conducted', value: '50+' },
      { label: 'Countries Featured', value: '6' },
      { label: 'Emotional Impact Score', value: '9.2/10' },
    ],
    awards: ['Cannes Lions Bronze', 'AICP Award'],
    testimonial: {
      quote: 'The script they wrote didn\'t just tell our story—it told the story of everyone who makes logistics possible. It\'s authentic because they took the time to truly understand us.',
      author: 'Robert Chen',
      role: 'CEO, Atlas Logistics',
    },
  },
  {
    id: 'neon-genesis',
    step: 'Pre-Production',
    project: 'Neon Genesis',
    client: 'TechVault Studios',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&q=80',
    heroVideo: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Scouted 23 locations across 4 countries, assembled a crew of 85, and created 200+ storyboard frames.',
    outcome: '6-week shoot completed on schedule',
    year: '2023',
    duration: '16 weeks',
    team: [
      { role: 'Director', name: 'Marcus Chen' },
      { role: 'Producer', name: 'Jennifer Park' },
      { role: 'Production Designer', name: 'Klaus Richter' },
      { role: 'Storyboard Artist', name: 'Yuki Tanaka' },
    ],
    overview: 'TechVault\'s flagship game launch required a cinematic trailer that would set the internet on fire. With a vision for cyberpunk aesthetics and practical effects, the pre-production phase became the foundation of everything.',
    challenge: 'The vision was ambitious: create a photo-real cyberpunk world using primarily practical sets and in-camera effects. This meant finding locations that could be transformed, coordinating a massive crew across multiple countries, and planning every shot with military precision.',
    solution: 'We developed an unprecedented pre-production pipeline. Our team scouted 23 locations across Tokyo, Hong Kong, Berlin, and Los Angeles. We built detailed scale models of every set, created 200+ storyboard frames, and rehearsed complex sequences in virtual reality before a single camera rolled.',
    behindTheScenes: [
      {
        title: 'Global Location Scouting',
        description: 'Three teams simultaneously scouted locations across four countries, using drone mapping and 3D scanning to document each potential set piece.',
        image: 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=800&q=80',
      },
      {
        title: 'Set Construction',
        description: 'Our production design team built three massive practical sets, including a 40-foot-tall neon-lit street scene with working holographic displays.',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
      },
      {
        title: 'VR Pre-visualization',
        description: 'The entire film was pre-visualized in VR, allowing the director to walk through every scene and refine camera movements before shooting.',
        image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800&q=80',
      },
    ],
    videos: [
      {
        title: 'Neon Genesis Trailer',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&q=80',
      },
      {
        title: 'Pre-Production Documentary',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=600&q=80',
      },
    ],
    stats: [
      { label: 'Locations Scouted', value: '23' },
      { label: 'Crew Size', value: '85' },
      { label: 'Storyboard Frames', value: '200+' },
      { label: 'Practical Sets Built', value: '3' },
    ],
    awards: ['Promax Gold', 'Key Art Award'],
    testimonial: {
      quote: 'The level of preparation was extraordinary. When we arrived on set, every single person knew exactly what they needed to do. That\'s the power of great pre-production.',
      author: 'Alex Novak',
      role: 'Creative Director, TechVault Studios',
    },
  },
  {
    id: 'velocity',
    step: 'Shooting',
    project: 'Velocity',
    client: 'Apex Motors',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&q=80',
    heroVideo: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Captured at 1000fps using phantom cameras, with a helicopter rig tracking vehicles at 180mph through canyon roads.',
    outcome: 'Industry-best automotive cinematography',
    year: '2024',
    duration: '4 weeks',
    team: [
      { role: 'Director', name: 'James Wright' },
      { role: 'DP', name: 'Nina Volkov' },
      { role: 'Aerial Coordinator', name: 'Tom Bradley' },
      { role: 'Precision Driver', name: 'Ricardo Santos' },
    ],
    overview: 'Apex Motors\' new hypercar demanded cinematography as revolutionary as the vehicle itself. We were tasked with capturing the raw power and precision of a machine capable of 280mph in ways that had never been done before.',
    challenge: 'Filming a vehicle moving at extreme speeds while maintaining cinematic quality is technically demanding. Add mountain canyon roads, unpredictable weather, and the need to capture intimate details of the car at 1000 frames per second, and you have one of the most challenging automotive shoots ever attempted.',
    solution: 'We developed custom camera rigs that could keep pace with the vehicle at 180mph. Our helicopter team coordinated intricate aerial ballets with the car, while ground-based Phantom cameras captured every detail in extreme slow motion. The result: 6 minutes of footage that redefined automotive cinematography.',
    behindTheScenes: [
      {
        title: 'Custom Rig Development',
        description: 'Our engineering team spent three months developing a stabilized chase vehicle capable of matching the hypercar\'s speed while providing a stable camera platform.',
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
      },
      {
        title: 'Aerial Choreography',
        description: 'Every helicopter move was precisely choreographed and rehearsed, with pilots and drivers communicating through a custom radio system.',
        image: 'https://images.unsplash.com/photo-1534397860164-120c97f4db0b?w=800&q=80',
      },
      {
        title: 'Ultra Slow Motion',
        description: 'Phantom Flex4K cameras captured at 1000fps, revealing details invisible to the human eye—tire deformation, air displacement, brake disc glow.',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      },
    ],
    videos: [
      {
        title: 'Velocity - Full Film',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&q=80',
      },
      {
        title: 'The Shoot - Behind The Scenes',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80',
      },
    ],
    stats: [
      { label: 'Top Speed Filmed', value: '180mph' },
      { label: 'Frame Rate', value: '1000fps' },
      { label: 'Flight Hours', value: '42' },
      { label: 'Terabytes Captured', value: '18TB' },
    ],
    awards: ['Automotive Content Award', 'Best Cinematography - ADC'],
    testimonial: {
      quote: 'We\'ve worked with many production companies, but no one has ever captured our cars with this level of artistry and technical excellence.',
      author: 'Henrik Johansson',
      role: 'Brand Director, Apex Motors',
    },
  },
  {
    id: 'metamorphosis',
    step: 'Post-Production',
    project: 'Metamorphosis',
    client: 'Aurora Fashion',
    image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=1200&q=80',
    heroVideo: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: '8 weeks of VFX work, 3,200 hours of color grading, and a bespoke Dolby Atmos soundscape.',
    outcome: 'Emmy nomination for cinematography',
    year: '2023',
    duration: '10 weeks',
    team: [
      { role: 'Director', name: 'Sofia Rodriguez' },
      { role: 'VFX Supervisor', name: 'Elena Petrova' },
      { role: 'Colorist', name: 'Akira Yamamoto' },
      { role: 'Sound Designer', name: 'Marcus Webb' },
    ],
    overview: 'Aurora Fashion\'s couture collection film required post-production that would elevate already stunning footage into something transcendent. Our mandate: create a sensory experience that would make viewers feel the fabric through the screen.',
    challenge: 'The raw footage was beautiful, but the creative vision demanded more—garments that seemed to breathe, environments that responded to movement, and a sonic landscape that would immerse viewers completely. Every frame needed to be a work of art.',
    solution: 'We assembled a post-production dream team. Over 8 weeks, our VFX artists created subtle digital enhancements that made fabrics flow with supernatural grace. Our colorist developed a signature look across 3,200 hours of grading. Our sound team crafted a Dolby Atmos soundscape where the rustle of silk becomes symphony.',
    behindTheScenes: [
      {
        title: 'VFX Enhancement',
        description: 'Subtle digital augmentation made garments move with impossible fluidity—extending trains, amplifying flow, creating an ethereal quality while maintaining photorealism.',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      },
      {
        title: 'Color Science',
        description: 'Our colorist developed a unique LUT for the project, spending weeks calibrating skin tones against fabric colors to achieve perfect harmony.',
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
      },
      {
        title: 'Immersive Sound',
        description: 'Every fabric was recorded in isolation with specialized microphones, then woven into a 7.1.4 Dolby Atmos mix that places viewers inside the fashion show.',
        image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80',
      },
    ],
    videos: [
      {
        title: 'Metamorphosis - Director\'s Cut',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=600&q=80',
      },
      {
        title: 'The Art of Post-Production',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80',
      },
    ],
    stats: [
      { label: 'VFX Shots', value: '847' },
      { label: 'Grading Hours', value: '3,200' },
      { label: 'Audio Channels', value: '7.1.4' },
      { label: 'Render Time', value: '12,000hrs' },
    ],
    awards: ['Emmy Nomination', 'AICP Post Award', 'Ciclope Craft Gold'],
    testimonial: {
      quote: 'The post-production team turned our film into something I didn\'t know was possible. Every second is a masterpiece of craft.',
      author: 'Claudia Beaumont',
      role: 'Creative Director, Aurora Fashion',
    },
  },
];

export const getCaseStudyById = (id: string): CaseStudy | undefined => {
  return caseStudies.find((study) => study.id === id);
};
