import { motion } from "framer-motion";

/** Minimalist ASCII surfer animation */
export function AsciiSurfer() {
  return (
    <div
      className="pointer-events-none select-none overflow-hidden opacity-[0.08] absolute inset-0"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* Waves row 1 — slow drift right */}
      <motion.div
        className="absolute bottom-32 left-0 whitespace-nowrap font-mono text-[11px] text-neutral-500 leading-none"
        animate={{ x: ["-50%", "0%"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      >
        {"~ ˜ ~ ˜ ~ ˜ ~ ˜ ~ ˜ ~ ˜ ~ ˜ ~ ˜ ~ ˜ ~ ˜ ~ ˜ ~ ˜ ~ ˜ ~ ˜ ~ ˜ ~ ˜ ~ ˜ ~ ˜ ~ ˜ ~ ˜ ~ ˜ ~ ˜ ~ ˜ ~ ˜ ~ ˜ ~ ˜ ~ ˜ ~ ˜ ~ ˜ ~ ˜ "}
      </motion.div>

      {/* Waves row 2 — slow drift left */}
      <motion.div
        className="absolute bottom-28 left-0 whitespace-nowrap font-mono text-[10px] text-neutral-400 leading-none"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      >
        {"˜ ~ ˜ ~ ˜ ~ ˜ ~ ˜ ~ ˜ ~ ˜ ~ ˜ ~ ˜ ~ ˜ ~ ˜ ~ ˜ ~ ˜ ~ ˜ ~ ˜ ~ ˜ ~ ˜ ~ ˜ ~ ˜ ~ ˜ ~ ˜ ~ ˜ ~ ˜ ~ ˜ ~ ˜ ~ ˜ ~ ˜ ~ ˜ ~ ˜ ~ ˜ ~ ˜ ~ ˜ "}
      </motion.div>

      {/* Waves row 3 — closest, drift right */}
      <motion.div
        className="absolute bottom-24 left-0 whitespace-nowrap font-mono text-xs text-neutral-400 leading-none"
        animate={{ x: ["-30%", "0%"] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      >
        {"≈ ~ ≈ ~ ≈ ~ ≈ ~ ≈ ~ ≈ ~ ≈ ~ ≈ ~ ≈ ~ ≈ ~ ≈ ~ ≈ ~ ≈ ~ ≈ ~ ≈ ~ ≈ ~ ≈ ~ ≈ ~ ≈ ~ ≈ ~ ≈ ~ ≈ ~ ≈ ~ ≈ ~ ≈ ~ ≈ ~ ≈ ~ ≈ ~ ≈ ~ ≈ ~ ≈ ~ ≈ "}
      </motion.div>

      {/* Surfer — rides across the waves */}
      <motion.div
        className="absolute bottom-[8.5rem] font-mono text-neutral-500 leading-none"
        animate={{ x: ["-100px", "calc(100vw + 100px)"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 2 }}
      >
        <pre className="text-[10px] leading-[1.1]">{
`    o
   /|\\
  / | 
 ___/\\___`
        }</pre>
      </motion.div>

      {/* Second surfer — smaller, slower, higher */}
      <motion.div
        className="absolute bottom-40 font-mono text-neutral-400 leading-none"
        animate={{ x: ["calc(100vw + 50px)", "-150px"] }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear", delay: 8 }}
      >
        <pre className="text-[8px] leading-[1.1]">{
`   o
  /|\\
 __/\\__`
        }</pre>
      </motion.div>

      {/* Distant waves row — very faint, top area */}
      <motion.div
        className="absolute bottom-44 left-0 whitespace-nowrap font-mono text-[8px] text-neutral-300 leading-none"
        animate={{ x: ["-40%", "0%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {"· ~ · ~ · ~ · ~ · ~ · ~ · ~ · ~ · ~ · ~ · ~ · ~ · ~ · ~ · ~ · ~ · ~ · ~ · ~ · ~ · ~ · ~ · ~ · ~ · ~ · ~ · ~ · ~ · ~ · ~ · ~ · ~ · ~ · ~ · ~ · ~ "}
      </motion.div>
    </div>
  );
}
