import { SVGProps } from "react";

export function UsaFlag(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 190 100"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Background stripes */}
      <rect width="190" height="100" fill="#b22234" />
      {[...Array(6)].map((_, i) => (
        <rect
          key={i}
          y={(i * 2 + 1) * (100 / 13)}
          width="190"
          height={100 / 13}
          fill="#fff"
        />
      ))}

      {/* Blue canton */}
      <rect width="76" height={(7 * 100) / 13} fill="#3c3b6e" />

      {/* Stars */}
      {Array.from({ length: 9 }).map((_, row) =>
        Array.from({ length: row % 2 === 0 ? 6 : 5 }).map((_, col) => (
          <polygon
            key={`${row}-${col}`}
            points="0,-2 0.59,-0.62 1.9,-0.62 0.95,0.24 1.31,1.62 0,0.9 -1.31,1.62 -0.95,0.24 -1.9,-0.62 -0.59,-0.62"
            fill="#fff"
            transform={`
              translate(
                ${6 + col * 12 + (row % 2 === 1 ? 6 : 0)},
                ${5 + row * 6}
              )
              scale(1.2)
            `}
          />
        ))
      )}
    </svg>
  );
}
