"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import CountdownTimer from "@/components/countdown-timer"
import VenueMap from "@/components/venue-map"
import HandwrittenMessage from "@/components/handwritten-message"
import WeddingTimeline from "@/components/wedding-timeline"

import { Variants } from "framer-motion"
import { useTranslation } from "@/lib/translations"
import { useLanguage } from "@/contexts/LanguageContext"
import { Button } from "@/components/ui/button"
import PhotoUploadSection from "@/components/photo-upload-section"
import RSVPSection from "@/components/rsvp-section"

// Format date in Arabic or English
const formatDate = (date: Date, locale: string) => {
  return date.toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Format time in Arabic or English
const formatTime = (date: Date, locale: string) => {
  return date.toLocaleTimeString(locale === 'ar' ? 'ar-EG' : 'en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

// Professional animation variants
const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { 
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as const
    }
  }
}

const slideUp: Variants = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as const
    }
  }
}

const scaleIn: Variants = {
  hidden: { scale: 0.98, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as const
    }
  }
}

// Professional flying entrance variants
const slideFromLeft: Variants = {
  hidden: { x: -120, opacity: 0, scale: 0.9 },
  visible: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { 
      duration: 1.2, 
      ease: [0.16, 1, 0.3, 1] as const,
      type: "spring",
      stiffness: 80,
      damping: 20
    }
  }
}

const slideFromRight: Variants = {
  hidden: { x: 120, opacity: 0, scale: 0.9 },
  visible: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { 
      duration: 1.2, 
      ease: [0.16, 1, 0.3, 1] as const,
      type: "spring",
      stiffness: 80,
      damping: 20
    }
  }
}

// Dramatic fly-in from far left
const flyFromLeft: Variants = {
  hidden: { x: -200, opacity: 0, scale: 0.8, rotate: -5 },
  visible: {
    x: 0,
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { 
      duration: 1.4, 
      ease: [0.16, 1, 0.3, 1] as const,
      type: "spring",
      stiffness: 60,
      damping: 18
    }
  }
}

// Dramatic fly-in from far right
const flyFromRight: Variants = {
  hidden: { x: 200, opacity: 0, scale: 0.8, rotate: 5 },
  visible: {
    x: 0,
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { 
      duration: 1.4, 
      ease: [0.16, 1, 0.3, 1] as const,
      type: "spring",
      stiffness: 60,
      damping: 18
    }
  }
}

// Floating entrance from left with bounce
const floatFromLeft: Variants = {
  hidden: { x: -150, y: -30, opacity: 0, scale: 0.7 },
  visible: {
    x: 0,
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { 
      duration: 1.5, 
      ease: [0.16, 1, 0.3, 1] as const,
      type: "spring",
      stiffness: 70,
      damping: 15
    }
  }
}

// Floating entrance from right with bounce
const floatFromRight: Variants = {
  hidden: { x: 150, y: -30, opacity: 0, scale: 0.7 },
  visible: {
    x: 0,
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { 
      duration: 1.5, 
      ease: [0.16, 1, 0.3, 1] as const,
      type: "spring",
      stiffness: 70,
      damping: 15
    }
  }
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 }
  }
}

const fastStaggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.05 }
  }
}

interface ProAnimatedEngagementPageProps {
  onImageLoad?: () => void;
  introFinished?: boolean;
}

export default function ProAnimatedEngagementPage({ onImageLoad, introFinished }: ProAnimatedEngagementPageProps) {
  const t = useTranslation()
  const { language } = useLanguage()
  const [mounted, setMounted] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [gifHasPlayed, setGifHasPlayed] = useState(false)
  const [gifPreloaded, setGifPreloaded] = useState(false)
  const gifRef = useRef<HTMLImageElement>(null)
  const gifTimerRef = useRef<NodeJS.Timeout | null>(null)
  const { scrollYProgress } = useScroll()
  const pathY1 = useTransform(scrollYProgress, [0, 0.5], [0, 20])
  const pathY2 = useTransform(scrollYProgress, [0, 0.5], [0, 40])

  const eventDate = new Date("2026-03-27T17:00:00");
  const formattedDate = formatDate(eventDate, language);
  const formattedTime = formatTime(eventDate, language);

  useEffect(() => {
    setMounted(true);

    if (typeof window !== 'undefined') {
      const staticImg = new window.Image();
      staticImg.src = "/invitation-design.png";
      staticImg.onload = () => {
        console.log('✅ Image preloaded and cached');
        setGifPreloaded(true);
      };
      staticImg.onerror = () => {
        console.log('⚠️ Image preload failed');
      };
    }

    // Cleanup timer on unmount
    return () => {
      if (gifTimerRef.current) {
        clearTimeout(gifTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (introFinished) {
      console.log('🎬 Intro finished, showing image');
      setGifHasPlayed(true);
    }
  }, [introFinished]);

  const handleImageLoad = () => {
    setImageLoaded(true)
    onImageLoad?.()
  }

  const handleGifError = () => {
    console.log('❌ Image error');
    setGifHasPlayed(true);
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20 overflow-x-hidden pt-0 touch-pan-y pointer-events-auto">
      {/* Hero Section */}
      <motion.section 
        className="relative w-full overflow-x-hidden pt-0 -mt-4 touch-pan-y"
        style={{ touchAction: 'pan-y' }}
        initial="hidden"
        animate="visible"
        variants={fastStaggerContainer}
      >
        <motion.div 
          className="relative w-full z-10 pt-0"
          variants={scaleIn}
        >
          {introFinished && (
            <div className="relative w-full pt-0 touch-pan-y">
              <video
                key="invitation-video"
                src="/invitation-design.mp4"
                className="w-full h-auto object-contain pointer-events-none"
                autoPlay
                muted
                playsInline
                onLoadedData={handleImageLoad}
                poster="/invitation-design.png"
              />
              
              {/* Minimal loading state */}
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center pointer-events-none">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm text-muted-foreground">{t('loading')}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
        
        <div className="mt-6 w-full max-w-2xl mx-auto text-center px-4">
        </div>
        
        {/* Scroll Down Indicator - Flying from left */}
        <motion.button
          onClick={() => {
            const countdownSection = document.querySelector('section[class*="py-12"]');
            countdownSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className="absolute bottom-14 left-2 flex flex-col items-center gap-3 z-20 cursor-pointer group touch-pan-y pointer-events-auto"
          style={{ touchAction: 'pan-y' }}
          initial="hidden"
          animate="visible"
          variants={flyFromLeft}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="bg-background/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-accent/30 group-hover:border-accent/50 transition-colors">
            <span className="text-base md:text-lg text-foreground font-medium tracking-wide">
              {language === 'ar' ? 'مرر للأسفل' : 'Scroll Down'}
            </span>
          </div>
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ 
              duration: 1.2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="bg-accent/90 p-2 rounded-full shadow-lg group-hover:bg-accent transition-colors"
          >
            <svg 
              className="w-8 h-8 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        </motion.button>
        
        {/* Animated floating background elements */}
        <motion.div 
          className="absolute -left-20 top-1/4 w-64 h-64 bg-[#f7f2e8] rounded-full mix-blend-multiply filter blur-3xl pointer-events-none"
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
          style={{ y: pathY1 }}
        />
        <motion.div 
          className="absolute -right-20 bottom-1/4 w-72 h-72 bg-[#f7f2e8] rounded-full mix-blend-multiply filter blur-3xl pointer-events-none"
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut", delay: 0.7 }}
          style={{ y: pathY2 }}
        />
      </motion.section>

      {/* Countdown Section - Unique frame with diagonal cuts */}
      <section 
        className="relative py-12 px-4 md:py-16 overflow-x-hidden touch-pan-y"
        style={{
          clipPath: 'polygon(0 5%, 100% 0%, 100% 95%, 0% 100%)',
        }}
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#f7f2e8] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#f7f2e8] rounded-full blur-3xl" />
        
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex flex-col items-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
              <svg className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
            </div>
            <h2 className="font-luxury text-5xl md:text-6xl lg:text-7xl text-foreground leading-tight mb-6 tracking-wide">
              {t('ourSpecialDay')}
            </h2>
            <p className="font-luxury text-3xl md:text-3xl lg:text-4xl font-bold max-w-3xl italic bg-clip-text text-transparent bg-gradient-to-br from-primary via-accent to-primary/60">
              {t('countingMoments')}
            </p>
          </div>

          <div>
            <CountdownTimer targetDate={new Date("2026-03-27T17:00:00")} />
          </div>
        </div>
      </section>

      {/* Venue & RSVP Section - Asymmetric frame */}
      <motion.section 
        className="relative py-20 px-4 md:py-32 bg-gradient-to-b from-transparent via-accent/5 to-transparent"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fastStaggerContainer}
        style={{
          clipPath: 'polygon(0 0%, 100% 5%, 100% 100%, 0% 95%)',
        }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-20"
            variants={fastStaggerContainer}
          >
            <motion.div className="flex items-center justify-center gap-4 mb-8" variants={floatFromLeft}>
              <motion.div 
                className="w-32 h-px bg-gradient-to-r from-transparent via-accent to-accent"
                initial={{ scaleX: 0, originX: 1 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.2 }}
              />
              <motion.div 
                className="w-3 h-3 rotate-45 bg-accent"
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 45 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
              />
              <motion.div 
                className="w-32 h-px bg-gradient-to-r from-accent via-accent to-transparent"
                initial={{ scaleX: 0, originX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.2 }}
              />
            </motion.div>
            <motion.h2 className="font-luxury text-5xl md:text-6xl lg:text-7xl text-foreground leading-tight mb-4 tracking-wide" variants={floatFromRight}>
              {t('joinUsAt')}
            </motion.h2>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <motion.div
              className="relative bg-card/80 backdrop-blur-sm border-2 border-accent/30 shadow-2xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{
                clipPath: 'polygon(3% 0%, 97% 0%, 100% 10%, 100% 90%, 97% 100%, 3% 100%, 0% 90%, 0% 10%)',
              }}
            >
              <div className="absolute inset-0 border-2 border-accent/20" />

              <div className="relative z-10 py-14 px-6 md:py-16">
                <div className="flex justify-center mb-4">
                  <svg className="w-10 h-10 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>

                <motion.h3
                  className="font-elegant text-4xl md:text-5xl lg:text-6xl text-foreground tracking-wide text-center"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  {t('location').split(', ')[0]}
                </motion.h3>

                <div className="mt-4 text-center">
                  <p className="text-sm md:text-base text-muted-foreground italic">
                    {t('location')}
                  </p>
                </div>

                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 max-w-3xl mx-auto">
                  <div
                    className="relative bg-background/40 border border-accent/25 rounded-xl px-6 py-5 shadow-sm"
                    style={{
                      clipPath: 'polygon(0 0, 86% 0, 100% 20%, 100% 100%, 14% 100%, 0 80%)',
                    }}
                  >
                    <div className="flex items-center justify-center gap-3">
                      <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-base md:text-lg text-foreground">{formattedDate}</span>
                    </div>
                  </div>

                  <div
                    className="relative bg-background/40 border border-accent/25 rounded-xl px-6 py-5 shadow-sm"
                    style={{
                      clipPath: 'polygon(14% 0, 100% 0, 100% 80%, 86% 100%, 0 100%, 0 20%)',
                    }}
                  >
                    <div className="flex items-center justify-center gap-3">
                      <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-base md:text-lg text-foreground">{formattedTime}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-10">
                  <VenueMap />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <section className="py-16">
        <div className="flex items-center justify-center gap-5 opacity-80 mb-10">
          <div className="h-px w-20 bg-accent/40" />
          <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 7.125L16.862 4.487" />
            </svg>
          </div>
          <div className="h-px w-20 bg-accent/40" />
        </div>
        <HandwrittenMessage />
      </section>

      <section id="rsvp" className="py-16 overflow-x-hidden">
        <RSVPSection />
      </section>

      <div className="flex items-center justify-center gap-5 opacity-80 mb-10">
        <div className="h-px w-20 bg-accent/40" />
        <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center">
          <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="h-px w-20 bg-accent/40" />
      </div>
      <WeddingTimeline />

      <PhotoUploadSection />

      <section className="w-full bg-[#f7f2e8] px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <img
            src="/middle-invitation.jpg"
            alt="Invitation"
            className="w-full h-auto object-contain rounded-2xl"
          />
        </div>
      </section>

      <motion.footer
        className="relative py-20 text-center bg-[#f7f2e8] border-t border-accent/10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-2xl mx-auto px-4 space-y-6 text-center">
          <motion.div
            className="inline-flex justify-center w-full"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <img
              src="/harry-potter.png"
              alt="Footer"
              className="mx-auto max-w-[280px] sm:max-w-md w-full h-auto"
            />
          </motion.div>
        </div>
      </motion.footer>
    </div>
  )
}

