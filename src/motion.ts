import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { PointerEvent } from 'react'

const revealTargets =
  '.hero > *, .section-head, .marquees, .chip-group > h3, .chip-group > p, .chips > li, .prose, .project-card, .timeline > li, .open-source > li, .blog-card, .activity-card, .contact-actions'

export function useReveal() {
  useLayoutEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries
          .filter((entry) => entry.isIntersecting)
          .forEach(({ target }, index) => {
            observer.unobserve(target)
            ;(target as HTMLElement).style.setProperty('--delay', `${Math.min(index, 5) * 70}ms`)
            target.classList.replace('reveal', 'rise')
          })
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    document.querySelectorAll(revealTargets).forEach((element) => {
      element.classList.add('reveal')
      observer.observe(element)
    })
    return () => observer.disconnect()
  }, [])
}

export function useActiveSection() {
  const [active, setActive] = useState('')
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries.find((entry) => entry.isIntersecting)
        if (current) setActive(current.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    document.querySelectorAll('.hero, main section').forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])
  return active
}

export function useNavIndicator(active: string) {
  const nav = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    const element = nav.current
    if (!element) return
    const place = () => {
      const link = element.querySelector<HTMLElement>('[aria-current]')
      element.style.setProperty('--on', link ? '1' : '0')
      if (!link) return
      element.style.setProperty('--x', `${link.offsetLeft}px`)
      element.style.setProperty('--y', `${link.offsetTop + link.offsetHeight + 3}px`)
      element.style.setProperty('--w', `${link.offsetWidth}`)
    }
    place()
    const observer = new ResizeObserver(place)
    observer.observe(element)
    return () => observer.disconnect()
  }, [active])
  return nav
}

export const tilt = {
  onPointerMove({ currentTarget, clientX, clientY }: PointerEvent<HTMLElement>) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect()
    currentTarget.style.setProperty('--ry', `${((clientX - left) / width - 0.5) * 4}deg`)
    currentTarget.style.setProperty('--rx', `${(0.5 - (clientY - top) / height) * 4}deg`)
  },
  onPointerLeave({ currentTarget }: PointerEvent<HTMLElement>) {
    currentTarget.style.removeProperty('--rx')
    currentTarget.style.removeProperty('--ry')
  },
}
