// Simple pass-through wrapper — can be upgraded with scroll-reveal animation later
export default function Reveal({ children, delay = 0 }) {
  return <div style={delay ? { animationDelay: `${delay}s` } : undefined}>{children}</div>;
}
