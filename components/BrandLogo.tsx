export function BrandLogo({ compact = false }: { compact?: boolean }) {
  const sizeClass = compact ? 'h-12 w-40 sm:h-14 sm:w-52 lg:h-16 lg:w-64' : 'h-20 w-72 md:h-24 md:w-96';

  return (
    <span className={`relative block max-w-full overflow-hidden ${sizeClass}`}>
      <img
        src="/assets/brand/attractive-logo.png"
        alt="Attractive Cosmetics Shop By Elka"
        loading="eager"
        decoding="async"
        width={500}
        height={500}
        className="absolute left-0 top-1/2 h-auto w-full max-w-none -translate-y-1/2"
      />
    </span>
  );
}
