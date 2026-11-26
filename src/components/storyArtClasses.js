const storyArtClasses = {
  moon: 'bg-[linear-gradient(145deg,_#9fc7be_0%,_#f6d891_100%)]',
  boat: 'bg-[linear-gradient(145deg,_#afcfe0_0%,_#e7d9bf_100%)]',
  kite: 'bg-[linear-gradient(145deg,_#f2b99c_0%,_#f4dc9d_100%)]',
  seed: 'bg-[linear-gradient(145deg,_#bed8aa_0%,_#ebd9aa_100%)]',
  written: 'bg-[linear-gradient(145deg,_#d5e8d0_0%,_#f3dca4_100%)]',
}

export function getStoryArtClass(art) {
  return storyArtClasses[art] || 'bg-soft-surface'
}
