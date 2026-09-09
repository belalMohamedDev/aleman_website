import React from 'react';
import { motion } from 'framer-motion';

export function HeroLeafShadows() {
  return (
    <div 
      className="absolute inset-0 z-10 pointer-events-none overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* ========================================================
          1. TOP-RIGHT HANGING BRANCH & LEAVES (Clear, vibrant & visible)
          ======================================================== */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          rotate: [0, 1.5, -1, 0],
          y: [0, -6, 3, 0]
        }}
        transition={{ 
          opacity: { duration: 0.8 },
          rotate: { repeat: Infinity, duration: 8, ease: "easeInOut" },
          y: { repeat: Infinity, duration: 7, ease: "easeInOut" }
        }}
        className="absolute top-0 right-0 w-[24rem] sm:w-[32rem] lg:w-[42rem] h-auto origin-top-right drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]"
      >
        <svg 
          viewBox="0 0 600 500" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto filter blur-[1.5px] sm:blur-[2.5px]"
        >
          <defs>
            {/* Primary vibrant leaf gradient */}
            <linearGradient id="leafGreenBright" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e6b37" />
              <stop offset="40%" stopColor="#14532d" />
              <stop offset="100%" stopColor="#082c16" />
            </linearGradient>

            {/* Sunlit top edge gradient */}
            <linearGradient id="leafGreenLit" x1="80%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2e8b4e" />
              <stop offset="50%" stopColor="#166534" />
              <stop offset="100%" stopColor="#09331a" />
            </linearGradient>

            {/* Deep shadow leaf gradient */}
            <linearGradient id="leafGreenDark" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#144d27" />
              <stop offset="100%" stopColor="#051f0f" />
            </linearGradient>

            <linearGradient id="stemGrad" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3d2814" />
              <stop offset="100%" stopColor="#1a1107" />
            </linearGradient>
          </defs>

          {/* Main Branch Stem */}
          <path
            d="M 620 -30 Q 460 90 320 250 T 170 420"
            stroke="url(#stemGrad)"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Leaf 1 - Topmost small */}
          <g>
            <path
              d="M 540 10 C 470 5 420 50 400 110 C 430 125 470 105 500 70 C 530 35 545 15 540 10 Z"
              fill="url(#leafGreenLit)"
            />
            <path d="M 520 20 Q 460 65 410 105" stroke="#34d399" strokeWidth="1" opacity="0.4" />
          </g>

          {/* Leaf 2 - Large upper hanging leaf */}
          <g>
            <path
              d="M 520 70 C 420 70 330 145 300 230 C 290 265 345 270 395 225 C 455 170 525 115 520 70 Z"
              fill="url(#leafGreenBright)"
            />
            {/* Center vein */}
            <path d="M 510 80 Q 400 160 310 245" stroke="#4ade80" strokeWidth="1.5" opacity="0.45" />
          </g>

          {/* Leaf 3 - Far left pointing leaf */}
          <g>
            <path
              d="M 440 150 C 340 170 250 260 210 355 C 195 385 250 390 300 335 C 360 270 435 200 440 150 Z"
              fill="url(#leafGreenLit)"
            />
            <path d="M 430 160 Q 320 265 220 370" stroke="#34d399" strokeWidth="1.5" opacity="0.4" />
          </g>

          {/* Leaf 4 - Drooping center leaf */}
          <g>
            <path
              d="M 370 230 C 270 260 200 360 170 460 C 160 490 210 485 260 425 C 315 355 375 280 370 230 Z"
              fill="url(#leafGreenBright)"
            />
            <path d="M 360 245 Q 260 355 180 470" stroke="#4ade80" strokeWidth="1.5" opacity="0.45" />
          </g>

          {/* Leaf 5 - Tip leaf reaching down */}
          <g>
            <path
              d="M 270 330 C 180 380 120 460 85 540 C 80 550 125 545 160 495 C 215 425 275 365 270 330 Z"
              fill="url(#leafGreenLit)"
            />
          </g>

          {/* Background darker leaves (giving 3D depth) */}
          <path
            d="M 560 120 C 470 140 400 230 380 310 C 370 335 410 330 440 290 C 485 230 545 170 560 120 Z"
            fill="url(#leafGreenDark)"
            opacity="0.85"
          />
          <path
            d="M 460 250 C 380 290 310 385 290 465 C 320 470 350 440 375 395 C 415 325 450 280 460 250 Z"
            fill="url(#leafGreenDark)"
            opacity="0.8"
          />
        </svg>
      </motion.div>

      {/* ========================================================
          2. RIGHT-SIDE MID-HEIGHT LEAVES (Reaching inward from right)
          ======================================================== */}
      <motion.div
        animate={{ 
          x: [0, -8, 0],
          rotate: [0, -1.8, 0]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 9, 
          ease: "easeInOut" 
        }}
        className="absolute top-[28%] -right-4 sm:right-0 w-[16rem] sm:w-[22rem] lg:w-[28rem] h-auto drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)]"
      >
        <svg 
          viewBox="0 0 400 350" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto filter blur-[2px] sm:blur-[3px]"
        >
          {/* Leaf A */}
          <path
            d="M 420 40 C 300 70 180 150 140 250 C 125 290 175 300 230 245 C 305 175 385 100 420 40 Z"
            fill="url(#leafGreenBright)"
          />
          {/* Leaf B */}
          <path
            d="M 420 150 C 320 180 230 250 190 340 C 180 370 225 375 270 325 C 335 260 395 195 420 150 Z"
            fill="url(#leafGreenLit)"
          />
          {/* Leaf C - deep shadow */}
          <path
            d="M 400 230 C 320 260 260 330 230 400 C 250 415 285 400 315 360 C 360 305 390 260 400 230 Z"
            fill="url(#leafGreenDark)"
            opacity="0.8"
          />
        </svg>
      </motion.div>

      {/* ========================================================
          3. BOTTOM FOREGROUND FOLIAGE (Framing the bottom edge)
          ======================================================== */}
      <motion.div
        animate={{ 
          y: [0, 5, 0],
          rotate: [0, 0.6, 0]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 7, 
          ease: "easeInOut" 
        }}
        className="absolute -bottom-6 right-0 w-full sm:w-[90%] lg:w-[70%] h-48 sm:h-60 lg:h-72 drop-shadow-[0_-10px_25px_rgba(0,0,0,0.6)]"
      >
        <svg 
          viewBox="0 0 1000 300" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full filter blur-[2px] sm:blur-[3.5px]"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="bottomLeafBright" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#042111" />
              <stop offset="40%" stopColor="#0e4f27" />
              <stop offset="100%" stopColor="#1f7a3f" />
            </linearGradient>

            <linearGradient id="bottomLeafLit" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#02140a" />
              <stop offset="50%" stopColor="#14532d" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>

          {/* Clustered bottom plant leaves reaching up */}
          {/* Leaf Cluster 1 (Far right) */}
          <path
            d="M 1020 300 C 970 210 900 110 830 50 C 810 30 840 10 875 35 C 930 85 990 180 1020 270 Z"
            fill="url(#bottomLeafLit)"
          />
          <path
            d="M 940 300 C 880 190 800 90 730 30 C 710 15 740 -5 775 15 C 835 65 900 160 950 260 Z"
            fill="url(#bottomLeafBright)"
          />

          {/* Leaf Cluster 2 (Mid-right under buttons) */}
          <path
            d="M 830 300 C 770 190 690 95 620 40 C 605 25 635 10 665 30 C 725 75 790 165 840 260 Z"
            fill="url(#bottomLeafLit)"
          />
          <path
            d="M 720 300 C 660 190 580 90 510 30 C 490 15 520 -5 550 15 C 615 65 680 160 730 260 Z"
            fill="url(#bottomLeafBright)"
          />

          {/* Leaf Cluster 3 (Reaching towards center) */}
          <path
            d="M 590 300 C 530 200 450 110 385 60 C 370 45 395 30 425 50 C 475 95 540 180 580 270 Z"
            fill="url(#bottomLeafLit)"
          />
          <path
            d="M 460 300 C 400 190 330 110 260 55 C 245 40 270 25 295 45 C 350 95 410 180 450 265 Z"
            fill="url(#bottomLeafBright)"
          />
          <path
            d="M 330 300 C 280 210 210 130 150 80 C 135 65 160 50 185 70 C 235 115 290 195 325 275 Z"
            fill="url(#bottomLeafLit)"
            opacity="0.85"
          />

          {/* Base ground bed */}
          <path
            d="M 0 300 L 1000 300 L 1000 230 C 900 180 800 240 700 190 C 600 150 500 220 400 170 C 300 120 200 190 100 140 C 50 120 20 160 0 200 Z"
            fill="url(#bottomLeafBright)"
            opacity="0.9"
          />
        </svg>
      </motion.div>
    </div>
  );
}
