import { useEffect, useRef, useState } from 'react'

export default function ScrollReveal({ children, className = '', delay = 0, pop = false, as: Element = 'div', ...props }) {
  const elementRef = useRef(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return undefined
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      setRevealed(true)
      return undefined
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setRevealed(true)
      observer.unobserve(entry.target)
    }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <Element
      {...props}
      ref={elementRef}
      className={`${className} ${pop && revealed ? 'animate-[scroll-card-pop_680ms_cubic-bezier(.2,.8,.2,1)_both]' : 'transition-[opacity,transform] duration-600 [transition-timing-function:cubic-bezier(.16,1,.3,1)]'} motion-reduce:animate-none motion-reduce:translate-y-0 motion-reduce:scale-100 motion-reduce:opacity-100 ${revealed ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-3 scale-[0.94] opacity-0'}`}
      style={{ transitionDelay: revealed ? `${delay}ms` : '0ms' }}
    >
      {children}
    </Element>
  )
}
