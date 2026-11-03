import { useEffect, useState } from 'react'
import type { CSSProperties, MouseEvent } from 'react'
import { flushSync } from 'react-dom'
import { Monitor, Moon, Sun } from 'lucide-react'

type Preference = 'system' | 'light' | 'dark'

const options = [
  { value: 'system', label: 'Use system theme', Icon: Monitor },
  { value: 'light', label: 'Use light theme', Icon: Sun },
  { value: 'dark', label: 'Use dark theme', Icon: Moon },
] as const

function readPreference(): Preference {
  try {
    const saved = localStorage.getItem('theme')
    if (saved === 'system' || saved === 'light' || saved === 'dark') return saved
  } catch {
    // Storage can be blocked; the default theme still works.
  }
  return 'dark'
}

export default function ThemeToggle() {
  const [preference, setPreference] = useState(readPreference)

  const choose = (value: Preference, { currentTarget }: MouseEvent<HTMLButtonElement>) => {
    const { left, top, width, height } = currentTarget.getBoundingClientRect()
    document.documentElement.style.setProperty('--reveal-x', `${left + width / 2}px`)
    document.documentElement.style.setProperty('--reveal-y', `${top + height / 2}px`)
    const update = () => flushSync(() => setPreference(value))
    if ('startViewTransition' in document) document.startViewTransition(update)
    else update()
  }

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => {
      const dark = preference === 'system' ? media.matches : preference === 'dark'
      document.documentElement.dataset.theme = dark ? 'dark' : 'light'
      const background = getComputedStyle(document.documentElement).getPropertyValue('--bg')
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', background)
    }
    apply()
    try {
      localStorage.setItem('theme', preference)
    } catch {
      // The choice just won't be remembered next visit.
    }
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [preference])

  return (
    <div
      className="theme-toggle"
      role="group"
      aria-label="Theme"
      style={{ '--index': options.findIndex(({ value }) => value === preference) } as CSSProperties}
    >
      {options.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          aria-label={label}
          aria-pressed={preference === value}
          title={label}
          onClick={(event) => choose(value, event)}
        >
          <Icon size={15} aria-hidden="true" />
        </button>
      ))}
    </div>
  )
}
