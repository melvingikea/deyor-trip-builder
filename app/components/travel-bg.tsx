import { motion } from "framer-motion";

/** Animated travel-themed background — subtle, warm, minimalist */
export function TravelBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* Warm gradient blobs */}
      <motion.div
        className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(232,70,76,0.06) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.1, 1], x: [0, 20, 0], y: [0, -10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(232,70,76,0.04) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.15, 1], x: [0, -15, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />
      <motion.div
        className="absolute top-1/3 left-1/2 w-[300px] h-[300px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(245,158,11,0.04) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.08, 1], y: [0, 15, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 6 }}
      />

      {/* SVG travel elements */}
      <svg
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Dotted path — like a travel route across the page */}
        <motion.path
          d="M-50,500 C200,450 300,300 500,350 S750,500 900,400 S1100,250 1300,300 S1500,450 1550,400"
          stroke="#e8464c"
          strokeWidth="1"
          strokeDasharray="4 8"
          fill="none"
          opacity="0.12"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4, ease: "easeOut" }}
        />

        {/* Small airplane following the path */}
        <motion.g
          animate={{ offsetDistance: ["0%", "100%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ offsetPath: "path('M-50,500 C200,450 300,300 500,350 S750,500 900,400 S1100,250 1300,300 S1500,450 1550,400')" } as React.CSSProperties}
          opacity="0.15"
        >
          <polygon points="0,-5 12,0 0,3 2,0" fill="#e8464c" />
        </motion.g>

        {/* Location pin 1 — top area */}
        <motion.g
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          opacity="0.08"
        >
          <path d="M350,280 C350,268 362,258 362,268 C362,278 350,292 350,292 C350,292 338,278 338,268 C338,258 350,268 350,280Z" fill="#e8464c" />
          <circle cx="350" cy="272" r="3" fill="white" />
        </motion.g>

        {/* Location pin 2 — right area */}
        <motion.g
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          opacity="0.08"
        >
          <path d="M1050,320 C1050,308 1062,298 1062,308 C1062,318 1050,332 1050,332 C1050,332 1038,318 1038,308 C1038,298 1050,308 1050,320Z" fill="#e8464c" />
          <circle cx="1050" cy="312" r="3" fill="white" />
        </motion.g>

        {/* Cloud 1 — top right */}
        <motion.g
          animate={{ x: [0, 25, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          opacity={0.06}
        >
          <ellipse cx="1100" cy="80" rx="55" ry="18" fill="#94a3b8" />
          <ellipse cx="1070" cy="72" rx="38" ry="15" fill="#94a3b8" />
          <ellipse cx="1140" cy="75" rx="32" ry="13" fill="#94a3b8" />
        </motion.g>

        {/* Cloud 2 — left */}
        <motion.g
          animate={{ x: [0, -18, 0] }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
          opacity={0.05}
        >
          <ellipse cx="200" cy="140" rx="48" ry="16" fill="#94a3b8" />
          <ellipse cx="170" cy="132" rx="32" ry="13" fill="#94a3b8" />
          <ellipse cx="235" cy="135" rx="28" ry="11" fill="#94a3b8" />
        </motion.g>

        {/* Compass — bottom right */}
        <motion.g
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "1340px 780px" }}
          opacity={0.08}
        >
          <circle cx="1340" cy="780" r="20" stroke="#94a3b8" strokeWidth="0.75" fill="none" />
          <circle cx="1340" cy="780" r="15" stroke="#94a3b8" strokeWidth="0.4" fill="none" />
          <polygon points="1340,762 1337,772 1340,769 1343,772" fill="#e8464c" />
          <polygon points="1340,798 1337,788 1340,791 1343,788" fill="#cbd5e1" />
          <line x1="1322" y1="780" x2="1327" y2="780" stroke="#94a3b8" strokeWidth="0.6" />
          <line x1="1353" y1="780" x2="1358" y2="780" stroke="#94a3b8" strokeWidth="0.6" />
        </motion.g>

        {/* Small mountains — bottom left */}
        <motion.g opacity="0.05">
          <polygon points="60,850 120,770 180,850" fill="#94a3b8" />
          <polygon points="140,850 210,760 280,850" fill="#94a3b8" />
          <polygon points="100,850 155,790 210,850" fill="#b0bec5" />
        </motion.g>

        {/* Sun — top left area */}
        <motion.g
          animate={{ scale: [1, 1.05, 1], opacity: [0.07, 0.1, 0.07] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "80px 60px" }}
        >
          <circle cx="80" cy="60" r="22" fill="#f59e0b" opacity="0.6" />
          <circle cx="80" cy="60" r="30" stroke="#f59e0b" strokeWidth="0.5" fill="none" opacity="0.3" />
          <circle cx="80" cy="60" r="38" stroke="#f59e0b" strokeWidth="0.3" fill="none" opacity="0.15" />
        </motion.g>
      </svg>
    </div>
  );
}
