import { primaryButtonClasses, secondaryButtonClasses } from './buttonClasses.js'

export default function HomeHero({ text, onExplore, onWrite }) {
  return (
    <section className="relative isolate grid min-h-[350px] place-items-center overflow-hidden bg-[#56a4e8] px-5 py-12 text-center transition-colors duration-700 ease-in-out dark:bg-[#142653] max-compact:min-h-[320px] max-compact:py-9" aria-labelledby="home-hero-title">
      <div className="pointer-events-none absolute inset-0 opacity-25" aria-hidden="true">
        <svg className="size-full [&_*]:transition-[fill] [&_*]:duration-700" viewBox="0 0 1440 400" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M-80 249C127 171 224 297 420 253C616 209 697 134 854 180C1011 226 1124 303 1518 190V430H-80V249Z" className="fill-[#9DD4FF] dark:fill-[#20396f]" />
          <path d="M-40 312C152 237 308 341 491 302C674 263 759 201 927 232C1095 263 1250 339 1480 258V430H-40V312Z" className="fill-[#D4EFFF] dark:fill-[#1a315f]" />
          <g className="[transform-box:fill-box] [transform-origin:center] [transform:translateX(-60px)] dark:[transform:translateX(-980px)]">
            <circle cx="1240" cy="69" r="58" className="fill-[#FFF4CC] dark:fill-[#fff0b0]" />
            <circle cx="1268" cy="40" r="53" className="fill-[#56a4e8] opacity-0 transition-opacity duration-[1500ms] [transition-timing-function:cubic-bezier(.22,.61,.36,1)] dark:fill-[#142653] dark:opacity-100" />
          </g>
        </svg>
      </div>
      <span className="absolute top-10 left-[12%] text-4xl text-[#fff1bf] transition-colors duration-700 dark:text-[#f9e9a6] max-compact:top-5 max-compact:left-[7%]" aria-hidden="true">✦</span>
      <span className="absolute top-[42%] right-[7%] text-3xl text-[#fff1bf] transition-colors duration-700 dark:text-[#f9e9a6] max-compact:top-[40%] max-compact:right-[5%]" aria-hidden="true">✦</span>
      <div className="relative z-[1] mx-auto max-w-[760px]">
        <span className="mb-4 inline-flex rounded-full bg-white/20 px-4 py-2 text-sm font-bold text-white">{text.eyebrow}</span>
        <h1 className="mx-auto my-0 inline-block bg-[#ffdc62] px-8 py-4 font-story text-[clamp(34px,5vw,60px)] font-bold leading-[1.08] tracking-[-0.04em] text-[#253b69] shadow-[5px_7px_0_#e9a942] [clip-path:polygon(2%_8%,98%_0,100%_88%,3%_100%)] max-compact:px-5 max-compact:py-4 max-compact:text-[34px]" id="home-hero-title">
          {text.heroTitle.split('\n').map((line, index) => <span className="block" key={`${line}-${index}`}>{line}</span>)}
        </h1>
        <p className="mx-auto mt-5 mb-0 max-w-[580px] text-base leading-relaxed text-white max-compact:text-sm">{text.heroText}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button className={`${primaryButtonClasses} min-w-[190px] rounded-xl bg-[#f16c61] text-white shadow-[0_5px_0_#c94749] hover:bg-[#e45c54] max-compact:w-full`} type="button" onClick={onExplore}>
            {text.explore}<span className="text-lg" aria-hidden="true">→</span>
          </button>
          <button className={`${secondaryButtonClasses} min-w-[170px] rounded-xl border-2 border-white bg-white text-[#315fce] shadow-[0_5px_0_rgba(31,72,126,0.2)] hover:bg-[#fff5d5] max-compact:w-full`} type="button" onClick={onWrite}>
            <span aria-hidden="true">✎</span>{text.createStory}
          </button>
        </div>
      </div>
    </section>
  )
}
