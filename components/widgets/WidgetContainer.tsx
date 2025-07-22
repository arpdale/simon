'use client'

import { motion } from 'framer-motion'
import { WidgetData } from '@/lib/types'
import RestaurantWidget from './RestaurantWidget'
import AttractionWidget from './AttractionWidget'
import HotelWidget from './HotelWidget'

interface WidgetContainerProps {
  widgets: WidgetData[]
}

export default function WidgetContainer({ widgets }: WidgetContainerProps) {
  if (widgets.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.3 }}
      className="mt-3 space-y-3"
    >
      {widgets.map((widget, index) => (
        <motion.div
          key={`${widget.type}-${index}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index }}
        >
          {widget.type === 'restaurant' && (
            <RestaurantWidget data={widget.data} />
          )}
          {widget.type === 'attraction' && (
            <AttractionWidget data={widget.data} />
          )}
          {widget.type === 'hotel' && (
            <HotelWidget data={widget.data} />
          )}
        </motion.div>
      ))}
    </motion.div>
  )
}