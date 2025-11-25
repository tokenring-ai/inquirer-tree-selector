# @tokenring-ai/inquirer-tree-selector

A tree selector prompt for [Inquirer.js](https://www.npmjs.com/package/inquirer) that enables hierarchical navigation and selection of items in a CLI interface. This package supports both single and multiple selections, lazy-loading of children, and customizable theming.

## Features

- **Hierarchical Navigation**: Navigate through tree structures using arrow keys
- **Multiple Selection Modes**: Support for both single and multiple item selection
- **Lazy Loading**: Async loading of child nodes for large datasets
- **Customizable Theming**: Full control over colors, symbols, and rendering
- **Keyboard Navigation**: Intuitive key controls for tree navigation
- **Pagination**: Efficient display of large trees with configurable page size
- **Cancel Support**: Optional cancellation with customizable messages

## Installation

```bash
pnpm add @tokenring-ai/inquirer-tree-selector
```

**Peer Dependencies:**
- `@types/node >= 20` (optional)

**Node.js Requirement:** >= 20

## Quick Start

### Basic Single Selection

```typescript
import { treeSelector } from '@tokenring-ai/inquirer-tree-selector';

const tree = {
  name: 'Root',
  children: [
    { name: 'File1', value: 'file1.txt' },
    {
      name: 'Folder',
      children: [
        { name: 'Subfile', value: 'subfile.txt' }
      ]
    }
  ]
};

const selected = await treeSelector({
  message: 'Select a file:',
  tree
});

console.log(selected); // e.g., 'file1.txt' or 'subfile.txt'
```

### Multiple Selection

```typescript
import { treeSelector } from '@tokenring-ai/inquirer-tree-selector';

const selected = await treeSelector({
  message: 'Select multiple files:',
  tree,
  multiple: true,
  allowCancel: true
});

console.log(selected); // e.g., ['file1.txt', 'subfile.txt'] or null
```

### Lazy Loading

```typescript
import { treeSelector } from '@tokenring-ai/inquirer-tree-selector';

async function loadChildren(parent) {
  // Simulate async loading
  return new Promise(resolve => setTimeout(() => {
    resolve([
      { name: 'Dynamic Item', value: 'dynamic' }
    ]);
  }, 100));
}

const tree = {
  name: 'Root',
  children: loadChildren // Async function
};

const selected = await treeSelector({
  message: 'Select from dynamic tree:',
  tree
});
```

## API Reference

### treeSelector()

The main function that creates and runs the tree selector prompt.

#### Signature

```typescript
// Single selection, no cancellation
treeSelector(config: PromptConfig & { multiple?: false; allowCancel?: false }): Promise<string>

// Single selection, with cancellation
treeSelector(config: PromptConfig & { multiple?: false; allowCancel: true }): Promise<string | null>

// Multiple selection, no cancellation
treeSelector(config: PromptConfig & { multiple: true; allowCancel?: false }): Promise<string[]>

// Multiple selection, with cancellation
treeSelector(config: PromptConfig & { multiple: true; allowCancel: true }): Promise<string[] | null>
```

#### Configuration Options

```typescript
interface PromptConfig {
  /** Main message displayed in the prompt */
  message: string;
  
  /** 
   * Tree structure or function to obtain it
   * Items can be strings or objects with name, value, and children properties
   */
  tree: Item;
  
  /** Maximum items displayed at once (default: 10) */
  pageSize?: number;
  
  /** Whether navigation loops from last to first element (default: false) */
  loop?: boolean;
  
  /** Whether canceling is allowed (default: false) */
  allowCancel?: boolean;
  
  /** Message when selection is canceled (default: 'Canceled.') */
  cancelText?: string;
  
  /** Message when current node has no children (default: 'No items available.') */
  emptyText?: string;
  
  /** Whether multiple items can be selected (default: false) */
  multiple?: boolean;
  
  /** Initial selection for the prompt */
  initialSelection?: string | string[];
  
  /** Custom theme for the prompt */
  theme?: PartialDeep<Theme<PromptTheme>>;
}
```

### Item Type

```typescript
type Item = {
  /** Name to display in the list */
  name: string;
  /** Value to put in selection list (if not provided, item is not selectable) */
  value?: string;
  /** Children of this item (can be array or async function) */
  children?: Item[] | ((parent?: Item) => Promise<Item[]> | Item[]);
};
```

### Keyboard Controls

| Key | Action |
|-----|--------|
| `↑` / `↓` | Navigate up/down through items |
| `←` / `→` | Navigate to parent/child nodes |
| `Space` | Toggle selection (multiple mode) / Select (single mode) |
| `Enter` | Confirm selection |
| `Esc` / `Q` | Cancel (if enabled) |
| `PageUp` / `PageDown` | Navigate by page |

### Theme Customization

```typescript
const customTheme = {
  prefix: {
    idle: chalk.cyan('?'),
    done: chalk.green('✔'),
    canceled: chalk.red('✖')
  },
  style: {
    active: (text: string) => chalk.cyan(text),
    selected: (text: string) => chalk.green(`${text} ✔`),
    unselected: (text: string) => text,
    cancelText: (text: string) => chalk.red(text),
    emptyText: (text: string) => chalk.red(text),
    group: (text: string) => chalk.yellowBright(text),
    item: (text: string) => text,
    message: (text: string, status: StatusType) => chalk.bold(text),
    help: (text: string) => chalk.italic.gray(text),
    answer: (text: string) => chalk.cyan(text)
  },
  hierarchySymbols: {
    branch: '├─',
    leaf: '└─'
  },
  help: {
    top: (allowCancel: boolean, multiple?: boolean) => {
      const keys = [
        `Press ${chalk.cyan('↑↓')} to navigate`,
        `${chalk.cyan('←→')} to navigate tree`,
        multiple ? `${chalk.cyan('Space')} to toggle selection` : `${chalk.cyan('Enter')} to select`,
        allowCancel ? `${chalk.cyan('Esc')} or ${chalk.cyan('Q')} to cancel` : ''
      ].filter(Boolean).join(', ');
      return `(${keys})`;
    },
    item: (multiple?: boolean) => {
      return multiple 
        ? '(Press Space to toggle selection)'
        : '(Press Enter to select)';
    }
  },
  renderItem: (item: Item, context: RenderContext) => {
    // Custom rendering logic
    return `${context.isSelected ? '✓ ' : '  '}${item.name}`;
  }
};
```

## Development

### Building

```bash
# Install dependencies
pnpm install

# Build the package
pnpm build

# Clean build artifacts
pnpm clean

# Lint and fix code
pnpm lint:fix
```

### Package Structure

```
pkg/inquirer-tree-selector/
├── src/
│   ├── index.ts          # Main entry point
│   ├── theme.ts          # Base theme implementation
│   ├── consts.ts         # Constants and status types
│   ├── types/            # TypeScript type definitions
│   │   ├── config.ts     # Prompt configuration interface
│   │   ├── item.ts       # Item type definition
│   │   ├── status.ts     # Status type
│   │   └── theme.ts      # Theme interface
│   └── utils/
│       └── key.ts        # Keyboard utility functions
├── dist/                 # Built output (generated)
├── package.json          # Package metadata
├── tsconfig.json         # TypeScript configuration
├── rollup.config.js      # Build configuration
└── README.md             # This documentation
```

## Dependencies

### Runtime Dependencies
- `@inquirer/core ^11.0.1` - Core Inquirer functionality
- `@inquirer/figures ^2.0.1` - Terminal figures and symbols
- `@inquirer/type ^4.0.1` - TypeScript utilities
- `chalk ^5.6.2` - Terminal styling

### Development Dependencies
- `@biomejs/biome ^2.3.7` - Linting and formatting
- `rollup ^4.53.3` - JavaScript bundler
- `typescript ^5.9.3` - TypeScript compiler
- `husky ^9.1.7` - Git hooks
- And various build and development tools

## Contributing

1. Follow conventional commit messages
2. Run `pnpm lint:fix` before committing
3. Use `nano-staged` for pre-commit hooks
4. Ensure all TypeScript types are properly defined

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Repository

Based on: https://github.com/br14n-sol/inquirer-tree-selector

## Examples

### File System Navigation

```typescript
const fileTree = {
  name: 'Project',
  children: [
    { name: 'src/', value: 'src/', children: [
      { name: 'index.ts', value: 'src/index.ts' },
      { name: 'utils.ts', value: 'src/utils.ts' }
    ]},
    { name: 'dist/', value: 'dist/', children: [
      { name: 'bundle.js', value: 'dist/bundle.js' }
    ]},
    { name: 'package.json', value: 'package.json' }
  ]
};

const selectedPath = await treeSelector({
  message: 'Select a file:',
  tree: fileTree,
  multiple: true
});
```

### Menu System

```typescript
const menuTree = {
  name: 'Main Menu',
  children: [
    {
      name: 'Settings',
      children: [
        { name: 'Profile', value: 'settings/profile' },
        { name: 'Preferences', value: 'settings/preferences' }
      ]
    },
    {
      name: 'Tools',
      children: [
        { name: 'Generator', value: 'tools/generator' },
        { name: 'Validator', value: 'tools/validator' }
      ]
    },
    { name: 'Exit', value: 'exit' }
  ]
};

const selection = await treeSelector({
  message: 'Choose an option:',
  tree: menuTree,
  allowCancel: true
});
```