import React from 'react';
import { motion } from 'framer-motion';

export function ParallaxAnimals() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none" aria-hidden="true">
      
      {/* Cow - Starts after Hero */}
      <motion.div 
        initial={{ opacity: 0, x: -150, rotate: -10 }}
        whileInView={{ opacity: 0.35, x: 0, rotate: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 1.2, type: 'spring', bounce: 0.3 }}
        className="absolute top-[120vh] left-[-10%] md:left-[-2%] w-[18rem] sm:w-[24rem] lg:w-[32rem] mix-blend-normal"
      >
        <motion.div animate={{ y: [0, -25, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}>
          <img src="/animal_cow.webp" alt="" loading="lazy" decoding="async" className="w-full h-auto object-contain filter drop-shadow-2xl" />
        </motion.div>
      </motion.div>

      {/* Ducks */}
      <motion.div 
        initial={{ opacity: 0, x: 150, scale: 0.8 }}
        whileInView={{ opacity: 0.4, x: 0, scale: 1 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 1.2, type: 'spring', bounce: 0.3 }}
        className="absolute top-[220vh] right-[-5%] md:right-[2%] w-[16rem] sm:w-[22rem] lg:w-[28rem] mix-blend-normal"
      >
        <motion.div animate={{ y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}>
          <img src="/animal_duck.webp" alt="" loading="lazy" decoding="async" className="w-full h-auto object-contain filter drop-shadow-2xl" />
        </motion.div>
      </motion.div>

      {/* Chickens */}
      <motion.div 
        initial={{ opacity: 0, x: -150, rotate: 10 }}
        whileInView={{ opacity: 0.35, x: 0, rotate: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 1.2, type: 'spring', bounce: 0.3 }}
        className="absolute top-[320vh] left-[-5%] md:left-[2%] w-[16rem] sm:w-[22rem] lg:w-[28rem] mix-blend-normal"
      >
        <motion.div animate={{ y: [0, -25, 0] }} transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.5 }}>
          <img src="/animal_chicken.webp" alt="" loading="lazy" decoding="async" className="w-full h-auto object-contain filter drop-shadow-2xl" />
        </motion.div>
      </motion.div>

      {/* Rabbits & Sheep removed from under products as requested */}

      {/* Pigeons - Flying randomly */}
      <motion.div 
        initial={{ opacity: 0, x: 200, y: -100 }}
        whileInView={{ opacity: 0.25, x: 0, y: 0 }}
        viewport={{ once: false, amount: 0.1 }}
        transition={{ duration: 1.5, type: 'spring' }}
        className="absolute top-[160vh] right-[10%] w-[12rem] sm:w-[16rem] lg:w-[20rem] mix-blend-normal"
      >
        <motion.div animate={{ y: [0, -40, 0], x: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}>
          <img src="/animal_pigeon.webp" alt="" loading="lazy" decoding="async" className="w-full h-auto object-contain filter drop-shadow-xl" />
        </motion.div>
      </motion.div>
    </div>
  );
}
