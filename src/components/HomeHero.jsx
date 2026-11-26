import { primaryButtonClasses } from './buttonClasses.js'

export default function HomeHero({ text, onExplore }) {
  return (
    <section className="relative grid min-h-[360px] grid-cols-[1.02fr_0.98fr] overflow-hidden rounded-[29px] bg-[#e9eee1] shadow-[0_15px_40px_rgba(43,63,50,0.06)] dark:bg-[#202b25] max-tablet:min-h-[330px] max-tablet:grid-cols-[1.05fr_0.95fr] max-compact:flex max-compact:flex-col max-compact:rounded-[23px]">
      <div className="relative z-[2] self-center py-[45px] pr-0 pb-12 pl-12 max-wide:pl-[35px] max-tablet:pt-[34px] max-tablet:pr-0 max-tablet:pb-9 max-tablet:pl-[30px] max-compact:pt-7 max-compact:px-[23px] max-compact:pb-5">
        <span className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#577065] dark:text-[#b7cbbd]">
          <span className="size-[7px] rounded-full bg-[#e98f70] shadow-[0_0_0_4px_rgba(233,143,112,0.16)]" aria-hidden="true" />
          {text.eyebrow}
        </span>
        <h1 className="mt-[14px] mb-[15px] max-w-[525px] font-story text-[clamp(37px,4.25vw,58px)] font-medium leading-[1.08] tracking-[-0.055em] text-[#173f35] dark:text-[#e0eee3] max-wide:text-[46px] max-tablet:text-[38px] max-compact:my-3 max-compact:text-[37px]">
          {text.heroTitle.split('\n').map((line) => <span className="block" key={line}>{line}</span>)}
        </h1>
        <p className="m-0 max-w-[440px] text-[15px] leading-[1.75] text-[#576b60] dark:text-[#c2cec5] max-tablet:text-[13px] max-compact:text-[13px]">{text.heroText}</p>
        <button className={`${primaryButtonClasses} mt-[25px] max-compact:mt-[18px]`} type="button" onClick={onExplore}>
          {text.explore}<span className="text-[17px] leading-none" aria-hidden="true">→</span>
        </button>
      </div>
      <div className="relative min-h-[360px] overflow-hidden bg-[linear-gradient(135deg,_#cddfcf_0%,_#dce8d6_54%,_#f3dfb9_100%)] max-tablet:min-h-[330px] max-compact:min-h-[190px]" aria-hidden="true">
        <span className="absolute top-[45px] right-[82px] size-[94px] rounded-full bg-[#f7d477] shadow-[0_0_0_15px_rgba(247,212,119,0.18),0_0_60px_rgba(247,212,119,0.34)] max-compact:top-[19px] max-compact:right-[58px] max-compact:size-[60px]" />
        <span className="absolute top-[105px] left-[54px] z-[1] h-5 w-[75px] rounded-full bg-[rgba(255,254,249,0.7)] before:absolute before:bottom-1 before:left-[15px] before:h-7 before:w-[26px] before:rounded-full before:bg-inherit before:content-[''] after:absolute after:bottom-1 after:left-[37px] after:h-[21px] after:w-5 after:rounded-full after:bg-inherit after:content-[''] max-compact:top-[60px] max-compact:left-[42px] max-compact:[transform:scale(0.75)]" />
        <span className="absolute top-40 right-[55px] z-[1] h-5 w-[60px] rounded-full bg-[rgba(255,254,249,0.7)] opacity-60 [transform:scale(0.8)] before:absolute before:bottom-1 before:left-[15px] before:h-7 before:w-[26px] before:rounded-full before:bg-inherit before:content-[''] after:absolute after:bottom-1 after:left-[37px] after:h-[21px] after:w-5 after:rounded-full after:bg-inherit after:content-[''] max-compact:top-[78px] max-compact:right-5" />
        <span className="absolute right-[-7%] bottom-[-39%] left-[-27%] h-[73%] w-[122%] rounded-[50%_50%_0_0] bg-[#97bd9d] [transform:rotate(-12deg)] max-compact:bottom-[-58%]" />
        <span className="absolute right-[-21%] bottom-[-49%] z-[1] h-[73%] w-[122%] rounded-[50%_50%_0_0] bg-[#5f9879] [transform:rotate(11deg)] max-compact:bottom-[-68%]" />
        <span className="absolute bottom-[67px] left-[39%] z-[3] flex h-[91px] w-[131px] drop-shadow-[0_14px_10px_rgba(31,58,46,0.17)] [transform:rotate(-7deg)] max-tablet:bottom-[62px] max-tablet:left-[31%] max-tablet:h-[78px] max-tablet:w-[110px] max-compact:bottom-[39px] max-compact:left-[40%] max-compact:h-[63px] max-compact:w-[91px] before:absolute before:top-2 before:bottom-[3px] before:left-1/2 before:w-[3px] before:bg-[rgba(37,68,54,0.18)] before:content-['']">
          <span className="h-full w-1/2 rounded-[15px_4px_5px_13px] border-4 border-[#f8f0d9] bg-[#f8f0d9] [transform:skewY(5deg)]" />
          <span className="h-full w-1/2 rounded-[4px_15px_13px_5px] border-4 border-[#f8f0d9] bg-[#f1c4a5] [transform:skewY(-5deg)]" />
        </span>
        <span className="absolute top-[68px] left-[31%] z-[2] text-[23px] text-[#fff5d2]">✦</span>
        <span className="absolute top-[194px] right-[21%] z-[2] text-sm text-[#fff5d2]">✦</span>
        <span className="absolute right-[29px] bottom-6 z-[4] inline-flex items-center gap-2 rounded-full border border-white/60 bg-[rgba(255,254,249,0.76)] px-[13px] py-[9px] text-[11px] font-bold text-[#325d49] backdrop-blur-[6px] max-compact:right-[11px] max-compact:bottom-[11px] max-compact:gap-2 max-compact:px-[9px] max-compact:py-[7px] max-compact:text-[9px]">
          <span className="grid size-[17px] place-items-center rounded-full bg-[#5a9874] text-[11px] text-white max-compact:size-[14px] max-compact:text-[9px]">✓</span>{text.offlineReady}
        </span>
      </div>
    </section>
  )
}
