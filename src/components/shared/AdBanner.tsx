interface AdBannerProps {
  size: 'leaderboard' | 'sidebar' | 'banner';
  className?: string;
}

const SIZE_CONFIG = {
  leaderboard: {
    width: 'w-full max-w-[728px]',
    height: 'h-[90px]',
    label: '728 × 90',
  },
  sidebar: {
    width: 'w-full max-w-[300px]',
    height: 'h-[250px]',
    label: '300 × 250',
  },
  banner: {
    width: 'w-full',
    height: 'h-[100px]',
    label: 'Banner Ad',
  },
};

export function AdBanner({ size, className }: AdBannerProps) {
  const config = SIZE_CONFIG[size];

  return (
    <div
      className={`${config.width} ${config.height} flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-gray-50 ${className ?? ''}`}
      aria-label="Advertisement"
    >
      <span className="text-sm text-gray-400">Ad</span>
      <span className="mt-0.5 text-xs text-gray-300">{config.label}</span>
    </div>
  );
}