import { SVGProps } from "react";

export function SpainFlag(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 190 100"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Franjas */}
      <rect width="190" height="100" fill="#c60b1e" />
      <rect y="25" width="190" height="50" fill="#ffc400" />

      {/* Escudo minimalista (estilo consistente con el tuyo) */}
      <g transform="translate(35, 38) scale(1.6)">
        <rect x="0" y="0" width="12" height="16" fill="#c60b1e" rx="1.5" />
        <rect x="3" y="4" width="6" height="8" fill="#ffc400" />

        {/* Básico minimal */}
        <rect x="2" y="2" width="3" height="2" fill="#ad1519" />
        <rect x="7" y="2" width="3" height="2" fill="#ad1519" />
        <rect x="4.5" y="8" width="3" height="2" fill="#c60b1e" />
      </g>
    </svg>
  );
}
