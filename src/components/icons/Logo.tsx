import { cn } from "@/lib/utils";
import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      {...props}
      className={cn("fill-current", props.className)}
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "hsl(var(--primary))", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "hsl(var(--accent))", stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path
        fill="url(#logo-gradient)"
        d="M50 0A50 50 0 1050 100 50 50 0 0050 0zm0 8a42 42 0 110 84 42 42 0 010-84z"
      />
      <path
        fill="hsl(var(--foreground))"
        d="M35 65v-9.3a14.8 14.8 0 01-5-1.7V65H20V35h10v9.3c1.7-1.1 3.6-1.8 5.6-1.8 5.8 0 10.4 4.7 10.4 10.4S41.4 63 35.6 63c-.2 0-.4 0-.6-.01V65H35zM35 53c2.8 0 5-2.2 5-5s-2.2-5-5-5-5 2.2-5 5 2.2 5 5 5z"
      />
      <path
        fill="hsl(var(--foreground))"
        d="M72.2 44.5c-3-2.5-6.8-4-11-4-7.5 0-13.6 5.5-13.6 13.6s5.2 13.9 13.9 13.9c3.2 0 6.1-1 8.5-2.8l-2.4-6.3c-1.5 1-3.4 1.6-5.4 1.6-4.5 0-7.8-3.3-7.8-7.5s3.4-7.4 7.5-7.4c2.5 0 4.6.8 6.2 2.3l-5.9 5.8h15.2V35l-5.4 9.5z"
      />
    </svg>
  );
}
