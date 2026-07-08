export default function Stars({ value = 5 }) {
  const full = Math.round(value);
  return (
    <span className="stars" aria-label={`${value} / 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} viewBox="0 0 24 24" fill={i <= full ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.3">
          <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17.7 6.8 19.2l1-5.8L3.5 9.2l5.9-.9z" />
        </svg>
      ))}
    </span>
  );
}
