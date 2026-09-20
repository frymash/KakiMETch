type LogoProps = {
  iconOnly?: boolean;
  className?: string;
};

export function Logo({ iconOnly = false, className }: LogoProps) {
  return (
    <span className={`logo${className ? ` ${className}` : ""}`}>
      <svg
        className="logo-mark"
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        aria-hidden="true"
      >
        <rect width="36" height="36" rx="9" fill="var(--teal)" />
        <circle cx="14.5" cy="16" r="6.5" fill="white" fillOpacity="0.95" />
        <circle cx="22.5" cy="21" r="6.5" fill="white" fillOpacity="0.55" />
      </svg>
      {iconOnly ? (
        <span className="sr-only">KakiMETch</span>
      ) : (
        <span className="logo-wordmark">
          Kaki<span className="logo-wordmark-accent">METch</span>
        </span>
      )}
    </span>
  );
}
