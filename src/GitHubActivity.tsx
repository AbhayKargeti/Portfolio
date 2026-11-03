import { useEffect, useRef, useState } from 'react'
import { profile } from './content'

type Day = { date: string; count: number; level: number }
type Activity = { days: Day[]; total: number }

const url = `https://github-contributions-api.jogruber.de/v4/${profile.githubUser}?y=last`

function parseDate(date: string) {
  return new Date(`${date}T00:00:00Z`)
}

function monthLabels(days: Day[], leading: number) {
  const labels: { column: number; name: string }[] = []
  days.forEach((day, index) => {
    const name = parseDate(day.date).toLocaleString('en', { month: 'short', timeZone: 'UTC' })
    if (labels.at(-1)?.name !== name) labels.push({ column: Math.floor((index + leading) / 7), name })
  })
  // A label in the last few weeks would stick out of the calendar and make it scroll.
  const visible = labels.filter((label) => label.column < 50)
  // A partial first month would run into the next label.
  return visible.length > 1 && visible[1].column - visible[0].column < 3 ? visible.slice(1) : visible
}

function Heatmap({ days, total }: Activity) {
  const leading = parseDate(days[0].date).getUTCDay()
  const summary = `${total} ${total === 1 ? 'contribution' : 'contributions'} in the last year`

  return (
    <>
      <h3>{summary}</h3>
      <div className="activity-scroll" tabIndex={0} role="region" aria-label="Contribution calendar">
        <div className="activity-months" aria-hidden="true">
          {monthLabels(days, leading).map((label) => (
            <span key={`${label.name}-${label.column}`} style={{ gridColumnStart: label.column + 1 }}>
              {label.name}
            </span>
          ))}
        </div>
        <div className="activity-days" role="img" aria-label={summary}>
          {Array.from({ length: leading }, (_, index) => (
            <span key={index} />
          ))}
          {days.map((day) => (
            <span
              key={day.date}
              className={`day level-${day.level}`}
              title={`${day.date}: ${day.count} ${day.count === 1 ? 'contribution' : 'contributions'}`}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default function GitHubActivity() {
  const [activity, setActivity] = useState<Activity | null>(null)
  const [failed, setFailed] = useState(false)
  const card = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const controller = new AbortController()
    fetch(url, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return response.json()
      })
      .then((data: { total: { lastYear: number }; contributions: Day[] }) => {
        if (data.contributions.length === 0) throw new Error('No contributions returned')
        setActivity({ days: data.contributions, total: data.total.lastYear })
      })
      .catch(() => {
        if (!controller.signal.aborted) setFailed(true)
      })
    return () => controller.abort()
  }, [])

  // On narrow screens the calendar scrolls, so start on the most recent weeks.
  useEffect(() => {
    const scroller = card.current?.querySelector('.activity-scroll')
    if (scroller) scroller.scrollLeft = scroller.scrollWidth
  }, [activity])

  return (
    <div className="activity-card" ref={card}>
      {activity && <Heatmap {...activity} />}
      {!activity && !failed && <p className="activity-status">Loading contributions…</p>}
      {failed && (
        <p className="activity-status">
          The contribution calendar couldn't load. <a href={profile.github}>See it on GitHub</a>.
        </p>
      )}
      <div className="activity-repos">
        <span>Top repositories:</span>
        <ul>
          {profile.topRepos.map((repo) => (
            <li key={repo}>
              <a href={`${profile.github}/${repo}`}>{repo}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
