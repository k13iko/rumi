import type { ReactNode } from 'react'

// Each icon is a small SVG drawing, stored by name
const paths = {
  dash: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </>
  ),
  doc: (
    <>
      <path d="M6 3h9l4 4v14H6z" />
      <path d="M9 11h7M9 15h7" />
    </>
  ),
  bolt: <path d="M13 3L5 14h6l-1 7 8-11h-6z" />,
  basket: (
    <>
      <path d="M3 10h18l-2 10H5z" />
      <path d="M8 10l3-6M16 10l-3-6" />
    </>
  ),
  pie: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v9h9" />
    </>
  ),
  home: (
    <>
      <path d="M4 11l8-7 8 7v9H4z" />
      <path d="M10 20v-6h4v6" />
    </>
  ),
  cog: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-4-4" />
    </>
  ),
  bell: (
    <>
      <path d="M6 17V11a6 6 0 0112 0v6l2 2H4z" />
      <path d="M10 21h4" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  scale: (
    <>
      <path d="M12 4v16M6 20h12M5 7h14" />
      <path d="M5 7l-3 7a3 3 0 006 0zM19 7l-3 7a3 3 0 006 0z" />
    </>
  ),
  play: <path d="M6 4l13 8-13 8z" />,
  swap: <path d="M4 8h14l-3-3M20 16H6l3 3" />,
  chev: <path d="M7 9l5-4 5 4M7 15l5 4 5-4" />,
  sliders: (
    <>
      <path d="M4 7h16M4 12h16M4 17h16" />
      <circle cx="9" cy="7" r="1.6" />
      <circle cx="15" cy="12" r="1.6" />
      <circle cx="8" cy="17" r="1.6" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l3 3 5-6" />
    </>
  ),
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  cup: (
    <>
      <path d="M5 9h12v5a5 5 0 01-5 5h-2a5 5 0 01-5-5z" />
      <path d="M17 10h2a2 2 0 010 4h-2M8 4v2M12 4v2" />
    </>
  ),
  leaf: (
    <>
      <path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15" />
      <path d="M5 19c3-5 6-8 10-10" />
    </>
  ),
  box: (
    <>
      <rect x="4" y="8" width="16" height="12" rx="1" />
      <path d="M4 8l2-4h12l2 4M12 8v4" />
    </>
  ),
  copy: (
    <>
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2" />
    </>
  ),
} satisfies Record<string, ReactNode>

// The list of valid icon names, taken from the table above
export type IconName = keyof typeof paths

// Usage: <Icon name="plus" size={16} />
export function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return (
    <svg className="i" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}