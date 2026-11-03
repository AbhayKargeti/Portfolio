import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import type { PointerEvent } from 'react'

const revealTargets =
  '.hero-panel, .hero .actions, .hero .socials, .section-head, .marquees, .chip-group > h3, .chip-group > p, .chips > li, .prose, .project-card, .timeline > li, .open-source > li, .blog-card, .activity-card, .contact-actions, .explore'

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
    const place = (link = element.querySelector<HTMLElement>('[aria-current]')) => {
      element.style.setProperty('--on', link ? '1' : '0')
      if (!link) return
      element.style.setProperty('--x', `${link.offsetLeft}px`)
      element.style.setProperty('--y', `${link.offsetTop + link.offsetHeight + 3}px`)
      element.style.setProperty('--w', `${link.offsetWidth}`)
    }
    const follow = ({ target }: Event) => {
      const link = (target as Element).closest('a')
      if (link) place(link)
    }
    const settle = () => place()
    place()
    const observer = new ResizeObserver(settle)
    observer.observe(element)
    element.addEventListener('pointerover', follow)
    element.addEventListener('pointerleave', settle)
    return () => {
      observer.disconnect()
      element.removeEventListener('pointerover', follow)
      element.removeEventListener('pointerleave', settle)
    }
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


export const magnet = {
  onPointerMove({ target, clientX, clientY }: PointerEvent<HTMLElement>) {
    const button = (target as Element).closest<HTMLElement>('.button')
    if (!button) return
    const { left, top, width, height } = button.getBoundingClientRect()
    button.style.setProperty('--mx', `${(clientX - left - width / 2) * 0.2}px`)
    button.style.setProperty('--my', `${(clientY - top - height / 2) * 0.3}px`)
  },
  onPointerOut({ target }: PointerEvent<HTMLElement>) {
    const button = (target as Element).closest<HTMLElement>('.button')
    button?.style.removeProperty('--mx')
    button?.style.removeProperty('--my')
  },
}

function glassMap(width: number, height: number, radius: number) {
  const canvas = document.createElement('canvas')
  canvas.width = Math.ceil(width / 2)
  canvas.height = Math.ceil(height / 2)
  const context = canvas.getContext('2d')
  if (!context) return ''
  const image = context.createImageData(canvas.width, canvas.height)
  const band = Math.min(26, height / 2)
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const px = x * 2 + 1 - width / 2
      const py = y * 2 + 1 - height / 2
      const qx = Math.abs(px) - width / 2 + radius
      const qy = Math.abs(py) - height / 2 + radius
      const outside = Math.hypot(Math.max(qx, 0), Math.max(qy, 0))
      const depth = radius - outside - Math.min(Math.max(qx, qy), 0)
      const strength = Math.max(1 - depth / band, 0) ** 2
      const nx = qx > 0 && qy > 0 ? qx / outside : qx > qy ? 1 : 0
      const ny = qx > 0 && qy > 0 ? qy / outside : qx > qy ? 0 : 1
      const offset = (y * canvas.width + x) * 4
      image.data[offset] = 128 - Math.sign(px) * nx * strength * 127
      image.data[offset + 1] = 128 - Math.sign(py) * ny * strength * 127
      image.data[offset + 2] = 128
      image.data[offset + 3] = 255
    }
  }
  context.putImageData(image, 0, 0)
  return canvas.toDataURL()
}

export function useLiquidGlass() {
  const ref = useRef<HTMLDivElement>(null)
  const id = `glass${useId().replace(/\W/g, '')}`
  useEffect(() => {
    const element = ref.current
    if (!element || !('userAgentData' in navigator) || !matchMedia('(pointer: fine)').matches) return
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('aria-hidden', 'true')
    svg.style.cssText = 'position:absolute;width:0;height:0'
    svg.innerHTML = `<filter id="${id}" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feImage result="map" preserveAspectRatio="none"/><feDisplacementMap in="SourceGraphic" in2="map" scale="52" xChannelSelector="R" yChannelSelector="G"/></filter>`
    document.body.append(svg)
    const filter = svg.querySelector('filter')
    const map = svg.querySelector('feImage')
    const render = () => {
      const { offsetWidth: width, offsetHeight: height } = element
      const radius = Math.min(parseFloat(getComputedStyle(element).borderRadius) || 0, width / 2, height / 2)
      for (const node of [filter, map]) {
        node?.setAttribute('x', '0')
        node?.setAttribute('y', '0')
        node?.setAttribute('width', `${width}`)
        node?.setAttribute('height', `${height}`)
      }
      map?.setAttribute('href', glassMap(width, height, radius))
      element.style.backdropFilter = `url(#${id}) blur(5px) saturate(170%)`
    }
    const observer = new ResizeObserver(render)
    observer.observe(element)
    return () => {
      observer.disconnect()
      svg.remove()
      element.style.removeProperty('backdrop-filter')
    }
  }, [id])
  return ref
}
