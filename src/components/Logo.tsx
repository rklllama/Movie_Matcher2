import React from 'react';
import { cn } from '../lib/utils';

interface LogoProps extends React.SVGProps<SVGSVGElement> {}

export function Logo({ className, ...props }: LogoProps) {
  return (
    <svg
      viewBox="0 0 120 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('h-6 w-6', className)}
      {...props}
    >
      {/* First M */}
      <path
        d="M10 80L30 20L50 60L70 20L90 80"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-current"
      />
      {/* Second M - with complete right leg */}
      <path
        d="M25 80L45 20L65 60L85 20L105 80"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-current opacity-50"
      />
    </svg>
  );
}