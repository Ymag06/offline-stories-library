const storyArtClasses = {
  moon: 'bg-[linear-gradient(145deg,_#7dd9d1_0%,_#b4e3ff_100%)]',
  boat: 'bg-[linear-gradient(145deg,_#79b8f4_0%,_#b6d6ff_100%)]',
  kite: 'bg-[linear-gradient(145deg,_#ff9b84_0%,_#ffd18a_100%)]',
  seed: 'bg-[linear-gradient(145deg,_#a6df9b_0%,_#e6ec91_100%)]',
  written: 'bg-[linear-gradient(145deg,_#c5a8ff_0%,_#ffc0d6_100%)]',
}

export function getStoryArtClass(art) {
  return storyArtClasses[art] || 'bg-soft-surface'
}
