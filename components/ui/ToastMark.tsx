interface Props {
  size?: number;
  /** Color of the toast slice. Defaults to currentColor. */
  color?: string;
  /** Color used for the dark grill marks on top — pass the surface behind the mark. */
  glow?: string;
}

export default function ToastMark({ size = 20, color = "currentColor", glow = "#1A1108" }: Props) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true">
      <path
        d="M4 13c0-3 2-5 5-5h14c3 0 5 2 5 5 0 2-1.5 2.5-2.5 2.5V24a3 3 0 0 1-3 3H9.5a3 3 0 0 1-3-3v-8.5C5.5 15.5 4 15 4 13z"
        fill={color}
        opacity={0.97}
      />
      <path
        d="M11 17v4M16 17v4M21 17v4"
        stroke={glow}
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.4}
      />
    </svg>
  );
}
