import { motion } from "framer-motion";

/** Minimalist animated travel SVG background — planes, clouds, map pins, compass */
export function TravelBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <svg
        viewBox="0 0 1200 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Dotted route path */}
        <motion.path
          d="M-50 650 Q200 500 400 550 T700 400 T1000 350 T1300 200"
          stroke="currentColor"
          className="text-brand-200"
          strokeWidth="2"
          strokeDasharray="8 8"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 3, ease: "easeInOut" }}
        />

        {/* Second dotted route */}
        <motion.path
          d="M1250 700 Q1000 600 800 620 T500 500 T200 480 T-50 350"
          stroke="currentColor"
          className="text-accent-200"
          strokeWidth="1.5"
          strokeDasharray="6 10"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 3.5, ease: "easeInOut", delay: 0.5 }}
        />

        {/* Cloud 1 — top right */}
        <motion.g
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 0.15 }}
          transition={{ duration: 2, delay: 0.5 }}
        >
          <ellipse cx="950" cy="120" rx="80" ry="30" fill="currentColor" className="text-neutral-400" />
          <ellipse cx="920" cy="110" rx="50" ry="25" fill="currentColor" className="text-neutral-400" />
          <ellipse cx="990" cy="115" rx="45" ry="20" fill="currentColor" className="text-neutral-400" />
        </motion.g>

        {/* Cloud 2 — top left */}
        <motion.g
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 0.1 }}
          transition={{ duration: 2, delay: 1 }}
        >
          <ellipse cx="200" cy="80" rx="70" ry="25" fill="currentColor" className="text-neutral-400" />
          <ellipse cx="170" cy="70" rx="45" ry="22" fill="currentColor" className="text-neutral-400" />
          <ellipse cx="240" cy="75" rx="40" ry="18" fill="currentColor" className="text-neutral-400" />
        </motion.g>

        {/* Airplane — flying along the route */}
        <motion.g
          initial={{ x: -100, y: 680 }}
          animate={{ x: 1100, y: 180 }}
          transition={{ duration: 6, ease: "easeInOut", delay: 1 }}
        >
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ duration: 1, delay: 1 }}
          >
            {/* Plane body */}
            <path
              d="M0 0 L-8 -3 L-30 -2 L-35 -8 L-30 -2 L-50 0 L-30 2 L-35 8 L-30 2 L-8 3 Z"
              fill="currentColor"
              className="text-brand-400"
              transform="rotate(-25)"
            />
          </motion.g>
        </motion.g>

        {/* Map pin 1 — bottom left area */}
        <motion.g
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 0.15 }}
          transition={{ duration: 1.5, delay: 2 }}
        >
          <path
            d="M150 580 C150 568 160 558 172 558 C184 558 194 568 194 580 C194 596 172 616 172 616 C172 616 150 596 150 580Z"
            fill="currentColor"
            className="text-brand-300"
          />
          <circle cx="172" cy="578" r="6" fill="white" opacity="0.6" />
        </motion.g>

        {/* Map pin 2 — right area */}
        <motion.g
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 0.12 }}
          transition={{ duration: 1.5, delay: 2.5 }}
        >
          <path
            d="M1020 450 C1020 438 1030 428 1042 428 C1054 428 1064 438 1064 450 C1064 466 1042 486 1042 486 C1042 486 1020 466 1020 450Z"
            fill="currentColor"
            className="text-accent-300"
          />
          <circle cx="1042" cy="448" r="6" fill="white" opacity="0.6" />
        </motion.g>

        {/* Compass — bottom right */}
        <motion.g
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 0.1 }}
          transition={{ duration: 2, delay: 1.5 }}
          style={{ originX: "1080px", originY: "680px" }}
        >
          <circle cx="1080" cy="680" r="35" stroke="currentColor" className="text-neutral-300" strokeWidth="1.5" fill="none" />
          <circle cx="1080" cy="680" r="30" stroke="currentColor" className="text-neutral-300" strokeWidth="0.5" fill="none" />
          {/* N arrow */}
          <path d="M1080 650 L1075 665 L1080 660 L1085 665Z" fill="currentColor" className="text-brand-300" />
          {/* S arrow */}
          <path d="M1080 710 L1075 695 L1080 700 L1085 695Z" fill="currentColor" className="text-neutral-300" />
          {/* Tick marks */}
          <line x1="1080" y1="648" x2="1080" y2="653" stroke="currentColor" className="text-neutral-300" strokeWidth="1" />
          <line x1="1080" y1="707" x2="1080" y2="712" stroke="currentColor" className="text-neutral-300" strokeWidth="1" />
          <line x1="1048" y1="680" x2="1053" y2="680" stroke="currentColor" className="text-neutral-300" strokeWidth="1" />
          <line x1="1107" y1="680" x2="1112" y2="680" stroke="currentColor" className="text-neutral-300" strokeWidth="1" />
        </motion.g>

        {/* Small floating dots — scattered waypoints */}
        {[
          { cx: 400, cy: 540, delay: 2.2 },
          { cx: 700, cy: 390, delay: 2.6 },
          { cx: 550, cy: 470, delay: 2.4 },
          { cx: 850, cy: 320, delay: 2.8 },
        ].map((dot, i) => (
          <motion.circle
            key={i}
            cx={dot.cx}
            cy={dot.cy}
            r="4"
            fill="currentColor"
            className="text-brand-300"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.2 }}
            transition={{ duration: 0.8, delay: dot.delay }}
          />
        ))}
      </svg>
    </div>
  );
}
