import { Info, AlertTriangle, Lightbulb } from 'lucide-react'

interface FieldHintProps {
  children: React.ReactNode
  type?: 'info' | 'warning' | 'tip'
  className?: string
}

export default function FieldHint({ children, type = 'info', className = '' }: FieldHintProps) {
  const icons = {
    info: Info,
    warning: AlertTriangle,
    tip: Lightbulb,
  }

  const colors = {
    info: 'text-gray-500',
    warning: 'text-yellow-600',
    tip: 'text-blue-500',
  }

  const Icon = icons[type]

  return (
    <div className={`flex items-start gap-1.5 mt-1.5 ${className}`}>
      <Icon className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${colors[type]}`} />
      <p className="text-sm text-gray-600 leading-relaxed">{children}</p>
    </div>
  )
}
