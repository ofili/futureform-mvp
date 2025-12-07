// 'use client';

// import Link from 'next/link';
// import { useSession } from 'next-auth/react';

// interface LogoProps {
//   className?: string;
//   href?: string;
// }

// export default function Logo({ className = '', href }: LogoProps) {
//   const { data: session, status } = useSession();

//   // Determine home route based on user role
//   const getHomeRoute = () => {
//     if (href !== undefined) return href; // Explicit href takes precedence

//     if (status === 'authenticated' && session?.user?.role) {
//       switch (session.user.role) {
//         case 'ADMIN':
//           return '/admin';
//         case 'PARTNER':
//           return '/partner';
//         case 'USER':
//         default:
//           return '/dashboard';
//       }
//     }

//     return '/'; // Unauthenticated users go to landing page
//   };

//   const linkHref = getHomeRoute();

//   const logoContent = (
//     <div className={`flex items-center gap-2 ${className}`}>
//       <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
//         <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//         </svg>
//       </div>
//       <span className="text-xl font-bold text-gray-900">Gitance</span>
//     </div>
//   );

//   if (linkHref) {
//     return (
//       <Link href={linkHref} className="hover:opacity-80 transition-opacity">
//         {logoContent}
//       </Link>
//     );
//   }

//   return logoContent;
// }

'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface LogoProps {
  className?: string;
  href?: string;
}

export default function Logo({ className = '', href }: LogoProps) {
  const { data: session, status } = useSession();

  // Determine home route based on user role
  const getHomeRoute = () => {
    if (href !== undefined) return href; // Explicit href takes precedence

    if (status === 'authenticated' && session?.user?.role) {
      switch (session.user.role) {
        case 'ADMIN':
          return '/admin';
        case 'PARTNER':
          return '/partner';
        case 'USER':
        default:
          return '/dashboard';
      }
    }

    return '/'; // Unauthenticated users go to landing page
  };

  const linkHref = getHomeRoute();

  const logoContent = (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Gitance Brand Icon - matches guidelines */}
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#0A1F44]">
        <svg
          className="w-5 h-5"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Circle */}
          <path
            d="M16 4a12 12 0 1 1-12 12 12 12 0 0 1 12-12z"
            stroke="#00C1B3"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Vertical line */}
          <line
            x1="16"
            y1="8"
            x2="16"
            y2="24"
            stroke="#00C1B3"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Horizontal line */}
          <line
            x1="8"
            y1="16"
            x2="24"
            y2="16"
            stroke="#00C1B3"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <span className="text-xl font-bold text-gray-900">Gitance</span>
    </div>
  );

  if (linkHref) {
    return (
      <Link href={linkHref} className="hover:opacity-80 transition-opacity">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}
