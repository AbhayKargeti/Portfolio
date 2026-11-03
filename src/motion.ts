import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import type { PointerEvent } from 'react'

const revealTargets = '.hero-panel, .hero .actions, .hero .socials'

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

type Letter = { el: HTMLElement; x: number; y: number; extra: number; line: number; f: number }
type TypeRoot = { letters: Letter[]; base: number; radius: number }

const peakWeight = 800

function measureType(root: HTMLElement): TypeRoot {
  const styles = getComputedStyle(root)
  const base = parseFloat(styles.fontWeight)
  const size = parseFloat(styles.fontSize)
  const els = [...root.querySelectorAll<HTMLElement>('.letter')]
  const rest = els.map((el) => parseFloat(getComputedStyle(el).width))
  els.forEach((el) => (el.style.fontWeight = `${peakWeight}`))
  const peak = els.map((el) => parseFloat(getComputedStyle(el).width))
  els.forEach((el, index) => {
    el.style.removeProperty('font-weight')
    el.style.width = `${rest[index]}px`
  })
  const box = root.getBoundingClientRect()
  const tops: number[] = []
  const letters = els.map((el, index) => {
    const rect = el.getBoundingClientRect()
    let line = tops.findIndex((top) => Math.abs(top - rect.top) < size / 2)
    if (line < 0) line = tops.push(rect.top) - 1
    return { el, x: rect.left + rect.width / 2 - box.left, y: rect.top + rect.height / 2 - box.top, extra: (peak[index] - rest[index]) * 1.2, line, f: 0 }
  })
  return { letters, base, radius: Math.max(size * 0.62, 34) }
}

export function useHoverType() {
  useEffect(() => {
    if (!matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return
    const measured = new Map<HTMLElement, TypeRoot>()
    const live = new Set<HTMLElement>()
    const pointer = { x: 0, y: 0, vx: 0, speed: 0 }
    let over: HTMLElement | null = null
    let frame = 0

    const clear = ({ letters }: TypeRoot) => {
      for (const letter of letters) {
        letter.f = 0
        letter.el.style.removeProperty('transform')
        letter.el.style.removeProperty('font-weight')
      }
    }
    const reset = () => {
      measured.forEach((entry) => {
        clear(entry)
        entry.letters.forEach(({ el }) => el.style.removeProperty('width'))
      })
      measured.clear()
      live.clear()
      over = null
    }
    const tick = (now: number) => {
      pointer.speed *= 0.9
      pointer.vx *= 0.88
      const boxes = [...live].map((root) => [root, root.getBoundingClientRect()] as const)
      for (const [root, box] of boxes) {
        const entry = measured.get(root)
        if (!entry) continue
        const sigma = 2 * entry.radius * entry.radius
        let moving = false
        const shift = new Map<number, number>()
        const totals = new Map<number, number>()
        for (const letter of entry.letters) {
          const dx = pointer.x - box.left - letter.x
          const dy = pointer.y - box.top - letter.y
          const target = root === over ? Math.exp(-(dx * dx + dy * dy) / sigma) : 0
          letter.f += (target - letter.f) * 0.16
          if (letter.f < 0.004 && target < 0.004) letter.f = 0
          else moving = true
          totals.set(letter.line, (totals.get(letter.line) ?? 0) + letter.extra * letter.f)
        }
        if (!moving) {
          clear(entry)
          live.delete(root)
          continue
        }
        const energy = Math.min(pointer.speed / 28, 1)
        const skew = Math.max(-11, Math.min(11, pointer.vx * 0.5))
        const wave = entry.radius * 0.1
        entry.letters.forEach((letter, index) => {
          const { el, f, extra, line } = letter
          const before = shift.get(line) ?? 0
          shift.set(line, before + extra * f)
          if (!f) {
            el.style.removeProperty('transform')
            el.style.removeProperty('font-weight')
            if (!before && !totals.get(line)) return
          }
          const x = before + (extra * f) / 2 - (totals.get(line) ?? 0) / 2
          const y = -f * wave * (0.6 + energy) + Math.sin(now / 150 + index * 0.75) * f * wave * energy
          el.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) skewX(${(-skew * f).toFixed(2)}deg) scale(${(1 + f * 0.035).toFixed(3)})`
          if (f) el.style.fontWeight = `${Math.round(entry.base + (peakWeight - entry.base) * f)}`
        })
      }
      frame = live.size ? requestAnimationFrame(tick) : 0
    }
    const move = ({ target, clientX, clientY }: globalThis.PointerEvent) => {
      const dx = clientX - pointer.x
      pointer.speed = Math.min(pointer.speed + Math.hypot(dx, clientY - pointer.y) * 0.5, 60)
      pointer.vx = Math.max(-40, Math.min(40, pointer.vx * 0.6 + dx * 0.4))
      pointer.x = clientX
      pointer.y = clientY
      over = (target as Element).closest?.<HTMLElement>('[data-hover-type]') ?? null
      if (!over) return
      if (!measured.has(over)) measured.set(over, measureType(over))
      live.add(over)
      if (!frame) frame = requestAnimationFrame(tick)
    }
    const leave = () => {
      over = null
    }

    document.fonts.ready.then(reset)
    addEventListener('resize', reset)
    addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(frame)
      removeEventListener('resize', reset)
      removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', leave)
      reset()
    }
  }, [])
}
