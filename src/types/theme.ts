import type {Item} from '#types/item'
import type {StatusType} from '#types/status'

export type RenderContext = {
  /** Items to render. */
  items: Item[]
  /** Indicates if the list is displayed in loop mode. */
  loop: boolean
  /** Item index. */
  index: number
  /** Indicates if the item is active. */
  isActive: boolean
  /** Indicates if the item is currently selected (in multiple selection mode). */
  isSelected?: boolean
  /** Indicates if multiple selection mode is enabled. */
  multiple?: boolean
}

export interface PromptTheme {
  prefix: {
    /**
     * The prefix displayed when the prompt is idle.
     * @default chalk.cyan('?')
     */
    idle: string
    /**
     * The prefix displayed when the prompt is done.
     * @default chalk.green(figures.tick)
     */
    done: string
    /**
     * The prefix displayed when the prompt is canceled.
     * @default chalk.red(figures.cross)
     */
    canceled: string
  }
  style: {
    /**
     * Defines the style for the active item.
     * @default chalk.cyan
     */
    active: (text: string) => string
    /**
     * Defines the style for selected items in multiple selection mode.
     * @default chalk.green with tick symbol
     */
    selected: (text: string) => string
    /**
     * Defines the style for unselected items in multiple selection mode.
     * @default spaces for alignment
     */
    unselected: (text: string) => string
    /**
     * Defines the style for the cancel text.
     * @default chalk.red
     */
    cancelText: (text: string) => string
    /**
     * Defines the style for empty text.
     * @default chalk.red
     */
    emptyText: (text: string) => string
    /**
     * Defines the style for groups
     * @default chalk.yellowBright
     */
    group: (text: string) => string
    /**
     * Defines the style for items
     * @default No style applied
     */
    item: (text: string) => string
    /**
     * Defines the style applied to the main message, defined in `config.message`.
     * @default chalk.bold
     */
    message: (text: string, status: StatusType) => string
    /**
     * Defines the style for help messages.
     * @default chalk.italic.gray
     */
    help: (text: string) => string
    /**
     * Defines the style for the final answer when prompt is done.
     * @default chalk.cyan
     */
    answer: (text: string) => string
  }
  hierarchySymbols: {
    /**
     * Symbol representing a branch in the tree hierarchy.
     * @default '├─'
     */
    branch: string
    /**
     * Symbol representing a leaf, marking the end of a the tree hierarchy.
     * @default '└─'
     */
    leaf: string
  }
  help: {
    /**
     * The help message displayed at the top of the prompt.
     * @param allowCancel - Indicates if canceling is allowed.
     * @param multiple - Indicates if multiple selection is enabled.
     */
    top: (allowCancel: boolean, multiple?: boolean) => string

    /**
     * The help message displayed for items.
     * @param multiple - Indicates if multiple selection is enabled.
     */
    item: (multiple?: boolean) => string
  }
  /**
   * Renders an item in the list.
   * @param item - The item to render.
   * @param context - Additional context about the item.
   */
  renderItem: (item: Item, context: RenderContext) => string
}
