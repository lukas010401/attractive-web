import type { ReactNode } from 'react';

type AppLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
};

export function AppLink({ href, className, children }: AppLinkProps) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}
