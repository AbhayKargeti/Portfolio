import { useEffect, useState } from 'react'
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

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => {
      const dark = preference === 'system' ? media.matches : preference === 'dark'
      document.documentElement.dataset.theme = dark ? 'dark' : 'light'
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
    <div className="theme-toggle" role="group" aria-label="Theme">
      {options.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          aria-label={label}
          aria-pressed={preference === value}
          title={label}
          onClick={() => setPreference(value)}
        >
          <Icon size={15} aria-hidden="true" />
        </button>
      ))}
    </div>
  )
}
