import { SVGProps } from 'react';

export function UsaFlag(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 24" {...props}>
      <path fill="#002868" d="M0 0h32v24H0z" />
      <path
        fill="#fff"
        d="M12.8 0h19.2v2.4H12.8zm0 4.8h19.2v2.4H12.8zm0 4.8h19.2v2.4H12.8zM0 16.8h32v2.4H0zm0 4.8h32v2.4H0z"
      />
      <path fill="#bf0a30" d="M0 2.4h32v2.4H0zm0 4.8h32v2.4H0zm0 4.8h12.8v2.4H0zm0 4.8h32v2.4H0zm0 4.8h32v2.4H0z" />
      <path fill="#fff" d="M0 0h12.8v12.8H0z" />
      <path fill="#002868" d="M1.6 1.6h9.6v9.6H1.6z" />
      <path
        fill="#fff"
        d="m6.4 8.55-1.545-1.118-1.545 1.118.588-1.81-1.545-1.118h1.907l.588-1.81.588 1.81h1.907l-1.545 1.118zm0-4.8L4.855 2.632 3.31 3.75l.588-1.81L2.353.822h1.907L4.85.988l.588 1.81h1.907L5.808 3.918zM4.25 6.15l-.588-1.81h-1.907l1.545-1.118-1.545-1.118h1.907l.588-1.81.588 1.81h1.907l-1.545 1.118 1.545 1.118h-1.907zm4.3,0l-.588-1.81h-1.907l1.545-1.118-1.545-1.118h1.907l.588-1.81.588 1.81h1.907l-1.545 1.118 1.545 1.118h-1.907z"
      />
    </svg>
  );
}
