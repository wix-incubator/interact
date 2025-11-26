const sections = [
  { href: '#introduction', label: 'Introduction' },
  { href: '#examples', label: 'Interactive Examples' },
  { href: '#api', label: 'API Cheatsheet' }
];

export const DocsSidebar = () => {
  return (
    <aside className="docs-sidebar">
      <div>
        <p className="sidebar-kicker">
          Interact
        </p>
        <h1 className="sidebar-title">Docs</h1>
        <p className="sidebar-tagline">
          Configuration first animation system powered by @wix/motion
        </p>
      </div>

      <nav className="sidebar-nav">
        {sections.map((section) => (
          <a key={section.href} href={section.href}>
            {section.label}
          </a>
        ))}
      </nav>
    </aside>
  );
};

