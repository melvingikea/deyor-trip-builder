import { motion } from "framer-motion";

/** Minimal floating clouds and a small compass — no lines, no routes */
export function TravelBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Cloud 1 — top right, gentle drift */}
        <motion.g
          animate={{ x: [0, 15, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          opacity={0.08}
        >
          <ellipse cx="1100" cy="100" rx="60" ry="20" fill="#94a3b8" />
          <ellipse cx="1070" cy="92" rx="40" ry="16" fill="#94a3b8" />
          <ellipse cx="1140" cy="95" rx="35" ry="14" fill="#94a3b8" />
        </motion.g>

        {/* Cloud 2 — top left, slower drift */}
        <motion.g
          animate={{ x: [0, -12, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          opacity={0.06}
        >
          <ellipse cx="250" cy="70" rx="50" ry="18" fill="#94a3b8" />
          <ellipse cx="220" cy="62" rx="35" ry="14" fill="#94a3b8" />
          <ellipse cx="285" cy="65" rx="30" ry="12" fill="#94a3b8" />
        </motion.g>

        {/* Cloud 3 — mid right, small */}
        <motion.g
          animate={{ x: [0, 10, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          opacity={0.05}
        >
          <ellipse cx="1250" cy="350" rx="40" ry="14" fill="#94a3b8" />
          <ellipse cx="1225" cy="344" rx="28" ry="11" fill="#94a3b8" />
          <ellipse cx="1278" cy="346" rx="24" ry="10" fill="#94a3b8" />
        </motion.g>

        {/* Cloud 4 — bottom left, tiny */}
        <motion.g
          animate={{ x: [0, -8, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          opacity={0.05}
        >
          <ellipse cx="120" cy="650" rx="35" ry="12" fill="#94a3b8" />
          <ellipse cx="100" cy="644" rx="22" ry="9" fill="#94a3b8" />
          <ellipse cx="148" cy="646" rx="20" ry="8" fill="#94a3b8" />
        </motion.g>

        {/* Compass — bottom right, slow spin */}
        <motion.g
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "1340px 800px" }}
          opacity={0.1}
        >
          <circle cx="1340" cy="800" r="18" stroke="#94a3b8" strokeWidth="0.75" fill="none" />
          <circle cx="1340" cy="800" r="14" stroke="#94a3b8" strokeWidth="0.4" fill="none" />
          {/* N */}
          <polygon points="1340,784 1337,793 1340,790 1343,793" fill="#94a3b8" />
          {/* S */}
          <polygon points="1340,816 1337,807 1340,810 1343,807" fill="#cbd5e1" />
          {/* E/W ticks */}
          <line x1="1324" y1="800" x2="1328" y2="800" stroke="#94a3b8" strokeWidth="0.6" />
          <line x1="1352" y1="800" x2="1356" y2="800" stroke="#94a3b8" strokeWidth="0.6" />
        </motion.g>
      </svg>
    </div>
  );
}
