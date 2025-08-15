import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'

interface SimonHeaderProps {
  onBackClick?: () => void
}

export default function SimonHeader({ onBackClick }: SimonHeaderProps) {
  const router = useRouter()

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick()
    } else {
      router.push('/')
    }
  }

  return (
    <div className="flex flex-row gap-3 items-center justify-start p-6 relative w-full">
      <button
        onClick={handleBackClick}
        className="relative shrink-0 w-6 h-6 hover:bg-gray-100 rounded-full p-1 transition-colors"
      >
        <ChevronLeft className="w-full h-full" stroke="black" strokeWidth={2} />
      </button>
      
      <div className="bg-black overflow-hidden relative rounded-full shrink-0 w-8 h-8 flex items-center justify-center">
        <img 
          src="/logos/bowtie-logo-black-bg.svg" 
          alt="Simon" 
          className="w-12 h-12"
        />
      </div>
      
      <div className="flex-1 font-semibold text-2xl text-black min-w-0">
        Simon
      </div>
    </div>
  )
}