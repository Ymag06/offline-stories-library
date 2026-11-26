export default function EmptyPage({ icon, brand, title, body, note }) {
  return (
    <section className="mx-auto grid min-h-[430px] max-w-[600px] content-center justify-items-start rounded-[25px] bg-[#e9eee1] p-10 max-compact:min-h-[360px] max-compact:p-[27px] dark:bg-card">
      <div className="mb-[23px] grid size-[60px] place-items-center rounded-[20px] bg-green text-[28px] text-white dark:text-[#10251a]" aria-hidden="true">{icon}</div>
      <span className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#577065] dark:text-[#b7cbbd]">{brand}</span>
      <h1 className="my-[9px] font-story text-[clamp(29px,4vw,43px)] font-medium leading-[1.2] text-green-dark">{title}</h1>
      <p className="m-0 max-w-[450px] leading-[1.7] text-[#66776d] dark:text-[#b8c5bd]">{body}</p>
      <div className="mt-[13px] inline-flex items-center gap-[9px] rounded-xl bg-[#edf1e7] px-[14px] py-3 text-xs font-bold text-[#57705f] dark:bg-[#2a3830] dark:text-[#d2e7d7]"><span className="text-[17px] text-[#d38b4b]" aria-hidden="true">✦</span><span>{note}</span></div>
    </section>
  )
}

