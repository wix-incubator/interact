import type { PropsWithChildren } from 'react';
import { DocsSidebar } from './Sidebar';

export const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="docs-layout">
      <DocsSidebar />
      <main className="docs-content">{children}</main>
    </div>
  );
};

