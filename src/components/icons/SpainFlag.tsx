import { SVGProps } from 'react';

export function SpainFlag(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20" {...props}>
      <path fill="#c60b1e" d="M0 0h30v20H0z" />
      <path fill="#ffc400" d="M0 5h30v10H0z" />
      <path
        fill="#c60b1e"
        d="M7.5 11.25V10h.75v-.75H9v.75h.75V10h.75v1.25H9v.75H8.25v-.75zm3.75 0V10h.75v-.75H12.75v.75H13.5V10h.75v1.25h-1.5v.75h-.75v-.75z"
      />
      <path fill="#ffc400" d="M9 11.25h.75v.75H9z" />
      <path fill="#ad1519" d="M8.25 10v.75H9V10zm3.75.75H12.75V10h-.75z" />
      <path
        fill="#c60b1e"
        d="M9.375 8.5h.75v.75h-.75zm0 1.5h.75v.75h-.75z"
      />
    </svg>
  );
}
