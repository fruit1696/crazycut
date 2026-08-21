export function RaymondWordmark({ className = '', reverse = false }) {
  return (
    <img
      src="/raymond-wordmark.svg"
      alt="Raymond"
      className={`inline-block h-[0.9em] w-auto max-w-none shrink-0 align-[-0.08em] ${reverse ? 'brightness-0 invert' : ''} ${className}`}
    />
  );
}

export function RaymondText({ children, logoClassName = '', reverse = false }) {
  if (typeof children !== 'string') return children;

  return children.split(/(Raymond)/gi).map((part, index) => (
    /^Raymond$/i.test(part) ? (
      <RaymondWordmark key={`${part}-${index}`} className={`mx-[0.14em] ${logoClassName}`} reverse={reverse} />
    ) : part
  ));
}

export default RaymondWordmark;
