import { useEffect, useState, useRef } from 'react'
import type { ElementType } from 'react'

interface SplitTextProps {
  text: string
  className?: string
  delay?: number
  duration?: number
  ease?: string
  splitType?: 'chars' | 'words'
  from?: { opacity?: number; y?: number }
  to?: { opacity?: number; y?: number }
  textAlign?: 'left' | 'center' | 'right'
  tag?: ElementType
  onLetterAnimationComplete?: () => void
}

export default function SplitText({
  text,
  className = '',
  delay = 40,
  duration = 0.7,
  from = { opacity: 0, y: 30 },
  to = { opacity: 1, y: 0 },
  textAlign = 'left',
  tag = 'h1',
  onLetterAnimationComplete,
}: SplitTextProps) {
  const [animKey, setAnimKey] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setAnimKey(prev => prev + 1)
    const totalTime = text.length * delay + duration * 1000
    timerRef.current = setTimeout(() => {
      onLetterAnimationComplete?.()
    }, totalTime)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [text, delay, duration, onLetterAnimationComplete])

  const Tag = tag
  const words = text.split(' ')
  let globalCharIndex = 0

  return (
    <Tag
      key={animKey}
      className={`split-parent ${className}`}
      style={{
        textAlign,
        display: 'block',
        whiteSpace: 'normal',
        wordBreak: 'break-word',
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes splitCharIn {
          from {
            opacity: ${from.opacity ?? 0};
            transform: translate3d(0, ${from.y ?? 30}px, 0);
          }
          to {
            opacity: ${to.opacity ?? 1};
            transform: translate3d(0, ${to.y ?? 0}px, 0);
          }
        }
      ` }} />
      {words.map((word, wordIndex) => {
        const chars = word.split('')
        return (
          <span
            key={wordIndex}
            aria-label={word}
            style={{
              display: 'inline-block',
              whiteSpace: 'nowrap',
              marginRight: wordIndex < words.length - 1 ? '0.28em' : '0',
            }}
          >
            {chars.map((char) => {
              const charIndex = globalCharIndex++
              return (
                <span
                  key={charIndex}
                  style={{
                    display: 'inline-block',
                    opacity: 0,
                    animationName: 'splitCharIn',
                    animationDuration: `${duration}s`,
                    animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                    animationDelay: `${charIndex * delay}ms`,
                    animationFillMode: 'forwards',
                    willChange: 'transform, opacity',
                  }}
                >
                  {char}
                </span>
              )
            })}
          </span>
        )
      })}
    </Tag>
  )
}
