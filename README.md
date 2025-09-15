# Inquirer Tree Selector Package Documentation

## Overview

The `@tokenring-ai/inquirer-tree-selector` package provides a tree selector prompt for [Inquirer.js](https://www.npmjs.com/package/inquirer), enabling hierarchical navigation and selection of items in a CLI interface. It supports both single and multiple selections, lazy-loading of children, and customizable theming. Users can navigate the tree using arrow keys (up/down for items, left/right for parent/child), space to toggle/select, enter to confirm, and escape to cancel (if enabled).

This prompt is ideal for scenarios like file system navigation, menu selections, or any nested data structure where users need to drill down into sub-options.

The package integrates seamlessly with Inquirer.js core, using its hooks for state management, keypress handling, and pagination.

## Installation/Setup

This package is part of a monorepo and uses pnpm as the package manager. To build and use it:

1. Ensure Node.js >=20 is installed.
2. Install dependencies: `pnpm install`.
3. Build the package: `pnpm build` (uses Rollup for bundling TypeScript to JavaScript).
4. For development: Use `pnpm lint` for checks and `pnpm clean` to remove dist/.

To use in another project:
```
pnpm add @tokenring-ai/inquirer-tree-selector
```
Peer dependency: `@types/node` >=20 (optional).

## Package Structure

```
pkg/inquirer-tree-selector/
├── src/
│   ├── index.ts          # Main entry point: treeSelector function implementation
│   ├── theme.ts          # Base theme with styles, symbols, and rendering logic
│   ├── consts.ts         # Constants (e.g., Status enum, ANSI codes)
│   ├── types/            # TypeScript type definitions
│   │   ├── config.ts     # PromptConfig interface
│   │   ├── item.ts       # Item type for tree nodes
│   │   ├── status.ts     # StatusType
│   │   └── theme.ts      # PromptTheme interface
│   └── utils/
│       └── key.ts        # Keypress utility functions (e.g., isLeftKey, isEscapeKey)
├── dist/                 # Built output (generated)
├── package.json          # Package metadata, scripts, dependencies
├── tsconfig.json         # TypeScript configuration
├── rollup.config.js      # Build configuration
├── biome.json            # Linting/formatting config (Biome)
└── README.md             # This documentation
```

Key entry point: `src/index.ts` exports `treeSelector` and re-exports types.

## Core Components

### treeSelector Function

The primary export is `treeSelector`, a prompt creator using `@inquirer/core`. It handles state for navigation, selection, and rendering.

- **Description**: Renders a paginated list of tree items, manages stack-based navigation (pushing/popping nodes), loads children (sync or async), and processes selections.
- **Key Parameters** (via `PromptConfig`):
  - `message: string` - Prompt message.
  - `tree: Item` - Root tree node (Item or function returning Item[]).
  - `pageSize?: number` (default: 10) - Items per page.
  - `loop?: boolean` (default: false) - Wrap navigation around list ends.
  - `allowCancel?: boolean` (default: false) - Enable Escape/Q to cancel.
  - `cancelText?: string` (default: 'Canceled.') - Cancel message.
  - `emptyText?: string` (default: 'No items available.') - No children message.
  - `multiple?: boolean` (default: false) - Allow multiple selections (returns string[]).
  - `initialSelection?: string | string[]` - Pre-select items by value.
  - `theme?: PartialDeep<Theme<PromptTheme>>` - Custom theme.
- **Return Types**:
  - Single mode: `Promise<string | null>`
  - Multiple mode: `Promise<string[] | null>`
- **Interactions**:
  - Uses `@inquirer/core` hooks: `useState` for status/selections/stack/active index; `useKeypress` for input; `usePagination` for rendering; `useEffect` for loading children; `usePrefix` for status icons.
  - Navigation: Up/Down/PageUp/PageDown change active index; Right enters child (if exists); Left goes to parent; Space toggles/selects; Enter confirms.
  - Rendering: Calls `theme.renderItem` for each visible item, using hierarchy symbols (branch/leaf).

### Item Type

Represents a tree node.

- **Properties**:
  - `name: string` - Display name.
  - `value?: string` - Selectable value (if omitted, non-selectable).
  - `children?: Item[] | ((parent?: Item) => Promise<Item[]> | Item[])` - Sub-items (sync array or async function).

Nodes without `value` act as groups/folders.

### PromptTheme

Customizable rendering and styling.

- **Properties**:
  - `prefix`: Object with `idle`, `done`, `canceled` (e.g., '?' , '✔', '✖').
  - `style`: Functions for `active`, `selected`, `unselected`, `cancelText`, `emptyText`, `group`, `item`, `message`, `help`, `answer` (using Chalk for colors).
  - `hierarchySymbols`: `{ branch: string, leaf: string }` (e.g., '├─', '└─').
  - `help`: Functions `top(allowCancel, multiple)` and `item(multiple)` for key hints.
  - `renderItem(item: Item, context: RenderContext): string` - Builds line with symbols, styles, and help (active items only).
- **Base Theme**: Defined in `theme.ts` using Chalk and `@inquirer/figures` for defaults (cyan active, green selected, etc.).

### Key Utilities

In `utils/key.ts`: Functions like `isLeftKey`, `isRightKey`, `isEscapeKey`, `isPageUp`, etc., to handle input events.

### Status

Enum: `'idle' | 'done' | 'canceled'`. Manages prompt lifecycle.

## Usage Examples

### 1. Basic Single Selection

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

const selected = await treeSelector({ message: 'Select a file:', tree });
console.log(selected); // e.g., 'file1.txt' or 'subfile.txt'
```

### 2. Multiple Selection with Lazy Loading

```typescript
import { treeSelector } from '@tokenring-ai/inquirer-tree-selector';

async function loadChildren(parent) {
  // Simulate async load
  return new Promise(resolve => setTimeout(() => {
    resolve([
      { name: 'Dynamic Item', value: 'dynamic' }
    ]);
  }, 100));
}

const tree = {
  name: 'Root',
  children: loadChildren  // Async function
};

const selected = await treeSelector({
  message: 'Select multiple:',
  tree,
  multiple: true,
  allowCancel: true
});
console.log(selected); // e.g., ['dynamic'] or null
```

### 3. With Custom Theme

```typescript
import { treeSelector } from '@tokenring-ai/inquirer-tree-selector';

const customTheme = {
  style: {
    active: (text) => `\x1b[31m${text}\x1b[0m`  // Red active
  }
};

const selected = await treeSelector({
  message: 'Custom styled select:',
  tree: /* your tree */,
  theme: customTheme
});
```

## Configuration Options

- All options in `PromptConfig` (see above).
- No environment variables; all via config object.
- Theme overrides via `PartialDeep<Theme<PromptTheme>>` for deep partial customization.

## API Reference

- `treeSelector(config: PromptConfig): Promise<string | string[] | null>`
  - Overloads for single/multiple modes.
- `type Item = { name: string; value?: string; children?: Item[] | ((parent?: Item) => Promise<Item[]> | Item[]) }`
- `interface PromptConfig { /* see types/config.ts */ }`
- `interface PromptTheme { /* see types/theme.ts */ }`
- `type StatusType = 'idle' | 'done' | 'canceled'`
- Re-exports: `Status` from consts.

## Dependencies

- **Runtime**: `@inquirer/core@^10.1.15`, `@inquirer/figures@^1.0.13`, `@inquirer/type@^3.0.8`, `chalk@^5.5.0`.
- **Build/Dev**: `@biomejs/biome@2.2.0`, Rollup plugins, TypeScript@5.9.2, Husky, etc.

## Contributing/Notes

- **Linting**: Use Biome (`pnpm lint:fix`).
- **Testing**: No tests in codebase; add via Vitest/Jest if contributing.
- **Building**: `pnpm build` generates `dist/` with .js, .d.ts.
- **Limitations**: Assumes text-based tree (no binary files); pagination for large lists; async children must resolve to arrays.
- **Repository**: Based on https://github.com/br14n-sol/inquirer-tree-selector.
- Contributions: Follow conventional commits; use nano-staged for pre-commit hooks.

