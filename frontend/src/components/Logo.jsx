// Logo ViaBTP (image favicon.png) — badge blanc arrondi.
export default function Logo({ size = 44, rounded = "rounded-xl", className = "" }) {
  return (
    <img
      src="/favicon.png"
      alt="ViaBTP"
      width={size}
      height={size}
      className={`${rounded} bg-white object-contain shrink-0 border border-brand-100 ${className}`}
      style={{ width: size, height: size, padding: 3 }}
    />
  );
}
