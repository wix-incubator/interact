import type { PropsWithChildren } from 'react';
import { Sidebar } from './Sidebar';

export function Layout({ children }: PropsWithChildren) {
  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="content-container">{children}</div>
      </main>
    </div>
  );
}
