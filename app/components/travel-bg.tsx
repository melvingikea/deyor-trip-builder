import { motion } from "framer-motion";

/** Ultra-subtle animated travel background — thin lines & small shapes, well below content */
export function TravelBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden opacity-[0.07]"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Thin curved route */}
        <motion.path
          d="M-20 780 C300 650 500 700 720 550 C940 400 1100 420 1460 250"
          stroke="currentColor"
          className="text-neutral-400"
          strokeWidth="1"
          strokeDasharray="6 12"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4, ease: "easeOut" }}
        />

        {/* Second thinner route */}
        <motion.path
          d="M1460 820 C1100 720 900 750 680 620 C460 490 300 510 -20 380"
          stroke="currentColor"
          className="text-neutral-300"
          strokeWidth="0.75"
          strokeDasharray="4 16"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 5, ease: "easeOut", delay: 1 }}
        />

        {/* Small waypoint dots along routes */}
        {[
          { cx: 360, cy: 700, d: 2 },
          { cx: 720, cy: 550, d: 2.8 },
          { cx: 1050, cy: 430, d: 3.4 },
          { cx: 900, cy: 730, d: 3 },
          { cx: 500, cy: 520, d: 3.6 },
        ].map((dot, i) => (
          <motion.circle
            key={i}
            cx={dot.cx}
            cy={dot.cy}
            r="3"
            fill="currentColor"
            className="text-neutral-400"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: dot.d }}
          />
        ))}

        {/* Tiny plane silhouette flying along first route */}
        <motion.g
          initial={{ offsetDistance: "0%" }}
          animate={{ offsetDistance: "100%" }}
          transition={{ duration: 8, ease: "linear", delay: 1.5 }}
          style={{ offsetPath: "path('M-20 780 C300 650 500 700 720 550 C940 400 1100 420 1460 250')" }}
        >
          <polygon
            points="0,-4 -10,2 -6,0 -10,4 0,1 10,4 6,0 10,2"
            fill="currentColor"
            className="text-neutral-500"
          />
        </motion.g>

        {/* Small compass circle — bottom right */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 2 }}
        >
          <circle cx="1320" cy="780" r="20" stroke="currentColor" className="text-neutral-300" strokeWidth="0.75" fill="none" />
          <line x1="1320" y1="762" x2="1320" y2="768" stroke="currentColor" className="text-neutral-400" strokeWidth="0.75" />
          <line x1="1320" y1="792" x2="1320" y2="798" stroke="currentColor" className="text-neutral-400" strokeWidth="0.75" />
          <line x1="1302" y1="780" x2="1308" y2="780" stroke="currentColor" className="text-neutral-400" strokeWidth="0.75" />
          <line x1="1332" y1="780" x2="1338" y2="780" stroke="currentColor" className="text-neutral-400" strokeWidth="0.75" />
        </motion.g>
      </svg>
    </div>
  );
}
