import type { CSSProperties } from 'react'
import { Key, KeyRound, Ribbon, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type Charm = {
  Icon: LucideIcon
  top: string
  left: string
  size: number
  rotate: number
  duration: number
  delay: number
  gold?: boolean
  desktopOnly?: boolean
}

const charms: Charm[] = [
  { Icon: Key, top: '8%', left: '4%', size: 44, rotate: -30, duration: 19, delay: 0, gold: true },
  { Icon: Ribbon, top: '18%', left: '88%', size: 52, rotate: 12, duration: 23, delay: -4 },
  { Icon: KeyRound, top: '34%', left: '12%', size: 32, rotate: 40, duration: 17, delay: -8, desktopOnly: true },
  { Icon: Key, top: '46%', left: '93%', size: 36, rotate: 70, duration: 21, delay: -2, gold: true },
  { Icon: Ribbon, top: '58%', left: '2%', size: 40, rotate: -18, duration: 25, delay: -11, gold: true },
  { Icon: KeyRound, top: '67%', left: '80%', size: 48, rotate: -45, duration: 20, delay: -6 },
  { Icon: Key, top: '78%', left: '20%', size: 30, rotate: 20, duration: 18, delay: -13, desktopOnly: true },
  { Icon: Ribbon, top: '88%', left: '94%', size: 34, rotate: 8, duration: 22, delay: -9, gold: true, desktopOnly: true },
  { Icon: KeyRound, top: '26%', left: '52%', size: 28, rotate: 15, duration: 24, delay: -15, gold: true, desktopOnly: true },
]

export function FloatingKeys() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {charms.map(({ Icon, top, left, size, rotate, duration, delay, gold, desktopOnly }, i) => (
        <span
          key={i}
          className={cn('drift absolute', desktopOnly && 'hidden md:block', gold ? 'text-poppy/55' : 'text-foreground/10')}
          style={
            {
              top,
              left,
              '--r': `${rotate}deg`,
              '--d': `${duration}s`,
              '--delay': `${delay}s`,
            } as CSSProperties
          }
        >
          <Icon style={{ width: size, height: size }} strokeWidth={1.25} />
        </span>
      ))}
    </div>
  )
}
