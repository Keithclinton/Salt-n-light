import { CSSProperties, FormEvent, ReactNode } from 'react';
import { useReveal } from '../hooks/useReveal';

interface RevealProps {
  children: ReactNode;
  as?: 'div' | 'section' | 'form';
  delay?: number;
  className?: string;
  onSubmit?: (e: FormEvent) => void;
}

export default function Reveal({ children, as = 'div', delay = 0, className = '', ...rest }: RevealProps) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const Tag = as;
  const style: CSSProperties = delay ? { transitionDelay: `${delay}ms` } : {};

  return (
    <Tag
      ref={ref as any}
      className={`reveal ${visible ? 'reveal--visible' : ''} ${className}`.trim()}
      style={style}
      {...rest}
    >
      {children}
    </Tag>
  );
}
