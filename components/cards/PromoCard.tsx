import Image from 'next/image'

interface PromoCardProps {
  title?: string
  description?: string
  buttonText?: string
  imageUrl?: string
  onButtonClick?: () => void
}

export default function PromoCard({
  title = "Welcome",
  description = "Get 20% off your first in-room dining order",
  buttonText = "See Menu",
  imageUrl = "/images/promo-card-image.jpg",
  onButtonClick
}: PromoCardProps) {
  return (
    <div className="flex flex-row gap-3.5 items-center justify-start p-[5px] relative rounded-[10px] w-full border border-gray-300 bg-white">
      <div className="relative rounded-[5px] shrink-0 w-24 h-24 overflow-hidden bg-gray-100">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          sizes="96px"
        />
      </div>
      <div className="flex-1 flex flex-col h-24 items-start justify-between py-0">
        <h3 className="font-semibold text-xl text-gray-800">
          {title}
        </h3>
        <p className="text-base text-gray-600 leading-snug">
          {description}
        </p>
        <button
          onClick={onButtonClick}
          className="bg-black text-white text-[15px] px-3.5 py-1 rounded hover:bg-gray-800 transition-colors"
        >
          {buttonText}
        </button>
      </div>
    </div>
  )
}