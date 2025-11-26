import type { PropsWithChildren, ReactNode } from 'react';

type SectionProps = PropsWithChildren<{
  id: string;
  title: string;
  kicker?: string;
  description?: ReactNode;
}>;

export const Section = ({ id, title, kicker, description, children }: SectionProps) => {
  return (
    <section id={id} className="section">
      {kicker ? (
        <p className="section-kicker">
          {kicker}
        </p>
      ) : null}
      <h2 className="section-title">{title}</h2>
      {description ? (
        <div className="section-description">
          {description}
        </div>
      ) : null}
      {children}
    </section>
  );
};

