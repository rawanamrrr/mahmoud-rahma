"use client"

import { motion } from "framer-motion"
import { useTranslation } from "@/lib/translations"
import { useLanguage } from "@/contexts/LanguageContext"
import { Utensils, Music, Camera, Sparkles, Heart } from "lucide-react"

const timelineEvents = [
  {
    time: "5:00 PM - 7:00 PM",
    translationKey: "timelineStart",
    icon: Heart,
    side: "right",
  },
  {
    time: "7:00 PM - 8:00 PM",
    translationKey: "timelineDinner",
    icon: Utensils,
    side: "left",
  },
  {
    time: "8:00 PM - 10:00 PM",
    translationKey: "timelineSecondHalf",
    icon: Music,
    side: "right",
  },
  {
    time: "10:00 PM - 11:00 PM",
    translationKey: "timelinePhotos",
    icon: Camera,
    side: "left",
  },
]

export default function WeddingTimeline() {
  const t = useTranslation()
  const { isRTL } = useLanguage()

  return (
    <section className="relative py-20 px-4 md:py-32 bg-[#f7f2e8] touch-pan-y">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="font-luxury text-5xl md:text-6xl lg:text-7xl text-foreground leading-tight mb-4 tracking-wide">
            {t("timelineTitle")}
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto rounded-full opacity-60" />
        </motion.div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Central Vertical Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-[1px] bg-accent/30" />

          {/* Events */}
          <div className="space-y-12 md:space-y-16 relative">
            {timelineEvents.map((event, index) => {
              const isRight = event.side === "right"
              const displayRight = isRTL ? !isRight : isRight

              return (
                <motion.div
                  key={index}
                  className="relative flex items-center justify-center min-h-[120px]"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  {/* Central Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-3 h-3 bg-foreground rounded-full border-[3px] border-[#fdfaf8] z-20 shadow-sm" />

                  <div className={`flex w-full items-center ${displayRight ? "flex-row" : "flex-row-reverse"}`}>
                    {/* Icon Side */}
                    <div className={`w-[45%] flex ${displayRight ? "justify-start" : "justify-end"} px-4 md:px-8`}>
                      <div className="p-4 rounded-full border border-foreground/5 bg-white/50 shadow-sm">
                        <event.icon className="w-8 h-8 md:w-10 md:h-10 text-foreground/80 stroke-[1.2px]" />
                      </div>
                    </div>

                    {/* Middle gap for the line */}
                    <div className="w-[10%]" />

                    {/* Text Side */}
                    <div className={`w-[45%] flex flex-col ${displayRight ? "items-start text-left" : "items-end text-right"} px-4 md:px-8`}>
                      <span className="font-luxury text-sm md:text-base tracking-widest text-foreground/60 uppercase mb-2">
                        {event.time}
                      </span>
                      <h3 className="font-luxury text-lg md:text-xl text-foreground tracking-widest uppercase leading-tight max-w-[200px]">
                        {t(event.translationKey as any).split(": ")[1] || t(event.translationKey as any)}
                      </h3>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Footer Decoration */}
        <motion.div 
          className="mt-20 flex justify-center opacity-40"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-[1px] bg-foreground/30" />
            <svg className="w-12 h-12 text-foreground/40" viewBox="0 0 100 20" fill="none" stroke="currentColor">
              <path d="M10,10 Q30,0 50,10 T90,10" strokeWidth="1" fill="none" />
              <circle cx="50" cy="10" r="2" fill="currentColor" />
            </svg>
            <div className="w-12 h-[1px] bg-foreground/30" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

