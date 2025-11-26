# Standalone Functions

The `@wix/interact` package exports two key standalone functions for managing interactions at the element level: `add()` and `remove()`. These functions work with `interact-element` custom elements to apply and remove interactions.

## Import

```typescript
import { add, remove } from '@wix/interact';
```

## Functions Overview

| Function | Purpose | Parameters | Returns |
|----------|---------|------------|---------|
| `add()` | Add interactions to an element | `element`, `key` | `boolean` |
| `remove()` | Remove interactions from an element | `key` | `void` |
| `addListItems()` | Add interactions to new list items | `root`, `key`, `listContainer`, `elements` | `void` |
| `removeListItems()` | Remove interactions from list items | `elements` | `void` |

---

## `add(element, key)`

Adds all configured interactions and effects to a `interact-element` based on its key configuration.

### Signature

```typescript
function add(element: IInteractElement, key: string): boolean
```

### Parameters

**`element: IInteractElement`**
- The custom `interact-element` that wraps the target content
- Must contain a child element that will be the actual target of animations
- Should have `data-interact-key` attribute matching the `key` parameter

**`key: string`**
- The unique identifier for the element in the interaction configuration
- Must match a key defined in an `Interact` instance's configuration
- Used to look up relevant interactions and effects

### Returns

**`boolean`**
- `true` if interactions were successfully added (element has triggers or effects)
- `false` if no interactions were found for this key

### Examples

#### Basic Usage
```typescript
import { Interact, add } from '@wix/interact';

// Create interaction configuration
const config = {
  interactions: [{
    trigger: 'viewEnter',
    key: 'my-hero',
    effects: [{ effectId: 'fade-in' }]
  }],
  effects: {
    'fade-in': {
      duration: 1000,
      keyframeEffect: {
        name: 'fade-in',
        keyframes: [
          { opacity: 0 },
          { opacity: 1 }
        ]
      }
    }
  }
};

Interact.create(config);

// Get the element and add interactions
const element = document.querySelector('interact-element[data-interact-key="my-hero"]');
const hasInteractions = add(element as IInteractElement, 'my-hero');

console.log('Interactions added:', hasInteractions);
```

#### Programmatic Element Creation
```typescript
// Create element programmatically
const wixElement = document.createElement('interact-element');
wixElement.setAttribute('data-interact-key', 'some-dynamic');

const content = document.createElement('div');
content.textContent = 'Animated content';
wixElement.appendChild(content);

document.body.appendChild(wixElement);

// Add interactions
const success = add(wixElement as IInteractElement, 'some-dynamic');
if (success) {
  console.log('Dynamic interactions added successfully');
}
```

### Behavior Details

#### What `add()` Does:
1. **Caches the Element**: Stores the element in `Interact.elementCache` for future reference
2. **Finds Configuration**: Looks up the interaction configuration for the given key
3. **Registers Triggers**: Sets up event listeners for all configured triggers (hover, click, etc.)
4. **Applies Effects**: Registers effects that target this element from other sources
5. **Handles Conditions**: Evaluates media queries and conditions to determine which interactions to activate
6. **Prevents Duplicates**: Tracks added interactions to avoid duplicate registrations

#### Element Requirements:
```html
<!-- ✅ Correct structure -->
<interact-element data-interact-key="my-hero">
  <div class="hero-content">Content to animate</div>
</interact-element>

<!-- ❌ Missing child element -->
<interact-element data-interact-key="my-hero">
  <!-- No child element - will log warning -->
</interact-element>

<!-- ❌ Missing data-interact-key -->
<interact-element>
  <div>Content</div>
</interact-element>
```

#### Error Handling:
```typescript
// The function handles various error cases gracefully
const element = document.querySelector('interact-element');

// Missing key
add(element as IInteractElement, ''); 
// Logs: "InteractElement: No key provided"

// Element without child
const emptyElement = document.createElement('interact-element');
add(emptyElement as IInteractElement, 'test');
// Logs: "InteractElement: No child element found"

// No matching configuration  
add(element as IInteractElement, 'nonexistent');
// Returns false, no errors
```

### Advanced Usage

#### Manual Element Management
```typescript
// Custom element creation with full control
class CustomWixElement extends HTMLElement implements IInteractElement {
  _internals: ElementInternals | null = null;
  connected: boolean = false;
  sheet: CSSStyleSheet | null = null;
  
  connectedCallback() {
    // Custom connection logic
    this.connect();
  }
  
  connect(key?: string) {
    const elementKey = key || this.dataset.wixPath;
    if (elementKey) {
      this.connected = add(this, elementKey);
    }
  }
  
  // Implement other required methods...
  disconnectedCallback() { /* ... */ }
  renderStyle(cssText: string) { /* ... */ }
  toggleEffect(effectId: string, method: StateParams['method']) { /* ... */ }
}

customElements.define('custom-wix-element', CustomWixElement);
```

#### Batch Processing
```typescript
// Add interactions to multiple elements efficiently
function addInteractionsToElements(selector: string) {
  const elements = document.querySelectorAll(selector);
  const results = new Map<string, boolean>();
  
  elements.forEach(element => {
    const key = element.getAttribute('data-interact-key');
    if (key) {
      const success = add(element as IInteractElement, key);
      results.set(key, success);
    }
  });
  
  return results;
}

// Usage
const results = addInteractionsToElements('interact-element');
console.log('Interaction results:', Object.fromEntries(results));
```

---

## `remove(key)`

Removes all interactions and effects from an element and cleans up associated resources.

### Signature

```typescript
function remove(key: string): void
```

### Parameters

**`key: string`**
- The unique identifier for the element to remove interactions from
- Should match the key used when interactions were added
- Used to look up the cached element and its interactions

### Returns

**`void`** - This function does not return a value

### Examples

#### Basic Removal
```typescript
import { remove } from '@wix/interact';

// Remove all interactions from an element
remove('hero');

// The element is no longer interactive and is removed from cache
console.log('Interactions removed for hero');
```

#### Dynamic Content Management
```typescript
// Remove interactions when content changes
function updateContent(key: string, newContent: string) {
  // Remove old interactions
  remove(key);
  
  // Update content
  const element = document.querySelector(`[data-interact-key="${key}"]`);
  if (element?.firstElementChild) {
    element.firstElementChild.textContent = newContent;
  }
  
  // Re-add interactions if needed
  if (element) {
    add(element as IInteractElement, key);
  }
}
```

#### Cleanup Before Page Navigation
```typescript
// Clean up all interactions before navigation
function cleanupInteractions() {
  const elements = document.querySelectorAll('interact-element[data-interact-key]');
  
  elements.forEach(element => {
    const key = element.getAttribute('data-interact-key');
    if (key) {
      remove(key);
    }
  });
  
  console.log('All interactions cleaned up');
}

// Call before page unload
window.addEventListener('beforeunload', cleanupInteractions);
```

### Behavior Details

#### What `remove()` Does:
1. **Finds Cached Element**: Looks up the element in `Interact.elementCache`
2. **Removes Event Listeners**: Calls `remove()` on all registered trigger handlers
3. **Clears Element State**: Resets any active interaction states on the element
4. **Cleans Instance State**: Calls `clearInteractionStateForKey()` on the managing instance
5. **Removes from Cache**: Deletes the element from `Interact.elementCache`

#### Safe to Call Multiple Times:
```typescript
// Safe to call remove() multiple times
remove('element');
remove('element'); // No error, simply does nothing
remove('nonexistent'); // No error, key not found
```

#### Automatic Cleanup:
```typescript
// The custom element automatically calls remove() when disconnected
const element = document.querySelector('interact-element[data-interact-key="auto"]');

// Removing from DOM automatically triggers cleanup
element?.remove(); // Calls remove('auto') internally
```

---

## `addListItems(root, key, listContainer, elements)`

Manually adds interactions to newly added list items in a dynamic list. This function is typically called automatically by the mutation observer when using `listContainer`, but can be called manually for advanced use cases.

### Signature

```typescript
function addListItems(
  root: IInteractElement,
  key: string,
  listContainer: string,
  elements: HTMLElement[]
): void
```

### Parameters

**`root: IInteractElement`**
- The `interact-element` that contains the list
- This is the element with `data-interact-key` matching the `key` parameter

**`key: string`**
- The unique identifier for the interaction configuration
- Must match a key defined in an `Interact` instance's configuration

**`listContainer: string`**
- CSS selector for the list container
- Must match the `listContainer` specified in the interaction configuration

**`elements: HTMLElement[]`**
- Array of new elements to add interactions to
- These elements should be children (or descendants) of the list container

### Examples

#### Manual List Item Addition
```typescript
import { addListItems } from '@wix/interact';

// Get the root element
const root = document.querySelector('interact-element[data-interact-key="product-list"]') as IInteractElement;

// Create new items
const newItems = [
  document.createElement('div'),
  document.createElement('div')
];

newItems.forEach((item, index) => {
  item.className = 'product-card';
  item.textContent = `Product ${index + 1}`;
});

// Add to DOM
const container = root.querySelector('.products');
newItems.forEach(item => container?.appendChild(item));

// Manually add interactions to new items
addListItems(root, 'product-list', '.products', newItems);
```

#### Batch Adding Items
```typescript
function addProductsToGrid(products) {
  const root = document.querySelector('interact-element[data-interact-key="products"]');
  const container = root.querySelector('.product-grid');
  
  const newElements = products.map(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${product.image}" />
      <h3>${product.name}</h3>
      <p>$${product.price}</p>
    `;
    return card;
  });
  
  // Add to DOM
  newElements.forEach(el => container.appendChild(el));
  
  // Add interactions
  addListItems(root, 'products', '.product-grid', newElements);
}
```

#### Automatic vs Manual Usage:

**Automatic (Recommended):**
```typescript
// When using listContainer, mutation observer handles this automatically
{
    key: 'auto-list',
    listContainer: '.items',
    trigger: 'hover',
    effects: [/* ... */]
}

// Just add to DOM - interactions apply automatically
const container = document.querySelector('.items');
container.appendChild(newElement);
```

**Manual (Advanced):**
```typescript
// For cases where you need explicit control
import { addListItems } from '@wix/interact';

const root = document.querySelector('[data-interact-key="manual-list"]');
const newItems = createItems();

// Add to DOM
container.append(...newItems);

// Manually trigger interaction setup
addListItems(root, 'manual-list', '.container', newItems);
```

---

## `removeListItems(elements)`

Removes all interactions and event listeners from list item elements. Called automatically by mutation observers when items are removed from a list, but can be called manually for cleanup.

### Signature

```typescript
function removeListItems(elements: HTMLElement[]): void
```

### Parameters

**`elements: HTMLElement[]`**
- Array of elements to remove interactions from
- These should be elements that previously had interactions added via `addListItems()` or automatically

### Examples

#### Manual Cleanup Before Removal
```typescript
import { removeListItems } from '@wix/interact';

function removeProduct(productElement) {
  // Remove from DOM
  productElement.remove();

// Clean up interactions
  removeListItems([productElement]);
}
```

#### Batch Removal
```typescript
function clearFilteredItems(category) {
  const items = document.querySelectorAll(`.product-card[data-category="${category}"]`);
  
  // Remove from DOM
  items.forEach(item => item.remove());
  
  // Clean up interactions
  removeListItems(Array.from(items));
}
```

---

## Performance Considerations

### Efficient Usage Patterns

#### ✅ Good: Batch Operations
```typescript
// Good: Process multiple elements efficiently
const elements = document.querySelectorAll('interact-element');
elements.forEach(el => {
  const key = el.dataset.wixPath;
  if (key) add(el as IInteractElement, key);
});
```

#### ❌ Avoid: Redundant Calls
```typescript
// Avoid: Calling add() multiple times for the same element
add(element, 'hero');
add(element, 'hero'); // Redundant - interactions already added
```

## Error Handling

Both functions include comprehensive error handling:

```typescript
// add() error scenarios
try {
  // Element without child
  const emptyElement = document.createElement('interact-element');
  add(emptyElement as IInteractElement, 'test');
  // Logs warning, returns false
  
  // Invalid key
  add(element, ''); 
  // Logs warning, returns false
  
  // No configuration found
  add(element, 'unconfigured');
  // Returns false silently
} catch (error) {
  // Functions don't throw, they log warnings
}

// remove() error scenarios
remove(''); // Safe, does nothing
remove('nonexistent'); // Safe, does nothing
```

## TypeScript Support

Full TypeScript support with proper type checking:

```typescript
import { add, remove, IInteractElement } from '@wix/interact';

const element = document.querySelector('interact-element') as IInteractElement;

if (element) {
  const success: boolean = add(element, 'hero');
  
  if (success) {
    console.log('Interactions added successfully');
  }
}

// Type-safe key parameter
const key: string = 'hero';
remove(key); // void return type
```

## See Also

- [Interact Class](interact-class.md) - Main interaction manager
- [Custom Element](interact-element.md) - `interact-element` API
- [Type Definitions](types.md) - `IInteractElement` and other types
- [Getting Started](../guides/getting-started.md) - Basic usage examples