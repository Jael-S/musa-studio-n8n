export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <svg
        aria-hidden="true"
        viewBox="0 0 48 48"
        className="h-12 w-12 shrink-0 drop-shadow-sm"
        fill="none"
      >
        <defs>
          <linearGradient id="musa-logo-gradient" x1="5" y1="5" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F43F7A" />
            <stop offset="1" stopColor="#A855F7" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="44" height="44" rx="15" fill="url(#musa-logo-gradient)" />
        <path
          d="M12 33V16.5L23.8 28 36 16.5V33"
          stroke="white"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3.2"
        />
        <path
          d="m35 7 1.35 3.65L40 12l-3.65 1.35L35 17l-1.35-3.65L30 12l3.65-1.35L35 7Z"
          fill="#FFF1F5"
        />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="text-2xl font-extrabold tracking-tight text-rose-700">
          musa
        </span>
        <span className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-purple-700">
          studio
        </span>
      </span>
    </div>
  );
}
