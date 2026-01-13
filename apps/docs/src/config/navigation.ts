export interface NavItem {
  label: string;
  path: string;
  children?: NavItem[];
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const navigation: NavSection[] = [
  {
    title: 'Getting Started',
    items: [
      { label: 'Introduction', path: '/' },
      { label: 'Getting Started', path: '/guides/getting-started' },
    ],
  },
  {
    title: 'Guides',
    items: [
      { label: 'Core Concepts', path: '/guides' },
      { label: 'Understanding Triggers', path: '/guides/understanding-triggers' },
      { label: 'Effects & Animations', path: '/guides/effects-and-animations' },
      { label: 'Configuration Structure', path: '/guides/configuration-structure' },
      { label: 'Custom Elements', path: '/guides/custom-elements' },
      { label: 'Lists & Dynamic Content', path: '/guides/lists-and-dynamic-content' },
      { label: 'State Management', path: '/guides/state-management' },
      { label: 'Conditions & Media Queries', path: '/guides/conditions-and-media-queries' },
    ],
  },
  {
    title: 'API Reference',
    items: [
      { label: 'Overview', path: '/api' },
      { label: 'Interact Class', path: '/api/interact-class' },
      { label: 'InteractionController', path: '/api/interaction-controller' },
      { label: 'Functions', path: '/api/functions' },
      { label: 'Custom Element', path: '/api/interact-element' },
      { label: 'Element Selection', path: '/api/element-selection' },
      { label: 'Type Definitions', path: '/api/types' },
    ],
  },
  {
    title: 'Examples',
    items: [
      { label: 'Overview', path: '/examples' },
      { label: 'Entrance Animations', path: '/examples/entrance-animations' },
      { label: 'Click Interactions', path: '/examples/click-interactions' },
      { label: 'Hover Effects', path: '/examples/hover-effects' },
      { label: 'List Patterns', path: '/examples/list-patterns' },
    ],
  },
  {
    title: 'Integration',
    items: [
      { label: 'Overview', path: '/integration' },
      { label: 'React', path: '/integration/react' },
    ],
  },
  {
    title: 'Advanced',
    items: [{ label: 'Overview', path: '/advanced' }],
  },
];

// Map URL paths to markdown file paths
export function getMarkdownPath(urlPath: string): string {
  if (urlPath === '/') {
    return 'README.md';
  }

  // Handle index/readme paths
  const pathWithoutLeadingSlash = urlPath.replace(/^\//, '');
  const segments = pathWithoutLeadingSlash.split('/');

  // Check if it's a category index (e.g., /guides, /api, /examples)
  if (segments.length === 1) {
    return `${segments[0]}/README.md`;
  }

  // Regular file path
  return `${pathWithoutLeadingSlash}.md`;
}
