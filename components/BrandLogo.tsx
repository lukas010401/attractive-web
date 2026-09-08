import Image from 'next/image';

export function BrandLogo({ compact = false }: { compact?: boolean }) {
  const sizeClass = compact ? 'h-20 w-64 md:h-24 md:w-80' : 'h-28 w-80 md:h-36 md:w-[28rem]';

  return (
    <span className={`relative block ${sizeClass}`}>
      <Image
        src="/assets/brand/attractive-logo.png"
        alt="Attractive Cosmetics Shop By Elka"
        layout="fill"
        objectFit="contain"
        priority={compact}
      />
    </span>
  );
}
