import type {Item} from '#types/item'
import type {PromptTheme} from '#types/theme'
import type {Theme} from '@inquirer/core'
import type {PartialDeep} from '@inquirer/type'

export interface PromptConfig {
  /** Main message displayed in the prompt. */
  message: string
  /**
   * List of tree items or function to obtain them.
   * Items are strings or objects with name, value, and children properties.
   */
  tree: Item
  /**
   * Max items displayed at once.
   * @default 10
   */
  pageSize?: number
  /**
   * Indicates if navigation is looped from the last to the first element.
   * @default false
   */
  loop?: boolean
  /**
   * Indicates if canceling is allowed.
   * @default false
   */
  allowCancel?: boolean
  /**
   * Message when selection is canceled.
   * @default 'Canceled.'
   */
  cancelText?: string
  /**
   * Message when the current node has no children.
   * @default 'No items available.'
   */
  emptyText?: string
  /**
   * Indicates if multiple items can be selected.
   * @default false
   */
  multiple?: boolean
  /**
   * Initial selection for the prompt.
   * For single selection mode: a single Item or value string
   * For multiple selection mode: an array of Items or value strings
   */
  initialSelection?: string | string[]
  /** Theme applied to the file selector. */
  theme?: PartialDeep<Theme<PromptTheme>>
}
