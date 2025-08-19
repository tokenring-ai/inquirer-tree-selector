import { Theme } from '@inquirer/core';
import { PartialDeep } from '@inquirer/type';

/** Possible prompt statuses. */
declare const Status: {
    readonly Idle: "idle";
    readonly Done: "done";
    readonly Canceled: "canceled";
};

type Item = {
    /** Name to display in the list */
    name: string;
    /** Value to put in selection list - if not provided, the item is not selectable */
    value?: string;
    /** Children of this item (if any) */
    children?: Item[] | ((parent?: Item) => Promise<Item[]> | Item[]);
};

/** Type representing possible prompt statuses. */
type StatusType = (typeof Status)[keyof typeof Status];

type RenderContext = {
    /** Items to render. */
    items: Item[];
    /** Indicates if the list is displayed in loop mode. */
    loop: boolean;
    /** Item index. */
    index: number;
    /** Indicates if the item is active. */
    isActive: boolean;
    /** Indicates if the item is currently selected (in multiple selection mode). */
    isSelected?: boolean;
    /** Indicates if multiple selection mode is enabled. */
    multiple?: boolean;
};
interface PromptTheme {
    prefix: {
        /**
         * The prefix displayed when the prompt is idle.
         * @default chalk.cyan('?')
         */
        idle: string;
        /**
         * The prefix displayed when the prompt is done.
         * @default chalk.green(figures.tick)
         */
        done: string;
        /**
         * The prefix displayed when the prompt is canceled.
         * @default chalk.red(figures.cross)
         */
        canceled: string;
    };
    style: {
        /**
         * Defines the style for the active item.
         * @default chalk.cyan
         */
        active: (text: string) => string;
        /**
         * Defines the style for selected items in multiple selection mode.
         * @default chalk.green with tick symbol
         */
        selected: (text: string) => string;
        /**
         * Defines the style for unselected items in multiple selection mode.
         * @default spaces for alignment
         */
        unselected: (text: string) => string;
        /**
         * Defines the style for the cancel text.
         * @default chalk.red
         */
        cancelText: (text: string) => string;
        /**
         * Defines the style for empty text.
         * @default chalk.red
         */
        emptyText: (text: string) => string;
        /**
         * Defines the style for groups
         * @default chalk.yellowBright
         */
        group: (text: string) => string;
        /**
         * Defines the style for items
         * @default No style applied
         */
        item: (text: string) => string;
        /**
         * Defines the style applied to the main message, defined in `config.message`.
         * @default chalk.bold
         */
        message: (text: string, status: StatusType) => string;
        /**
         * Defines the style for help messages.
         * @default chalk.italic.gray
         */
        help: (text: string) => string;
        /**
         * Defines the style for the final answer when prompt is done.
         * @default chalk.cyan
         */
        answer: (text: string) => string;
    };
    hierarchySymbols: {
        /**
         * Symbol representing a branch in the tree hierarchy.
         * @default '├─'
         */
        branch: string;
        /**
         * Symbol representing a leaf, marking the end of a the tree hierarchy.
         * @default '└─'
         */
        leaf: string;
    };
    help: {
        /**
         * The help message displayed at the top of the prompt.
         * @param allowCancel - Indicates if canceling is allowed.
         * @param multiple - Indicates if multiple selection is enabled.
         */
        top: (allowCancel: boolean, multiple?: boolean) => string;
        /**
         * The help message displayed for items.
         * @param multiple - Indicates if multiple selection is enabled.
         */
        item: (multiple?: boolean) => string;
    };
    /**
     * Renders an item in the list.
     * @param item - The item to render.
     * @param context - Additional context about the item.
     */
    renderItem: (item: Item, context: RenderContext) => string;
}

interface PromptConfig {
    /** Main message displayed in the prompt. */
    message: string;
    /**
     * List of tree items or function to obtain them.
     * Items are strings or objects with name, value, and children properties.
     */
    tree: Item;
    /**
     * Max items displayed at once.
     * @default 10
     */
    pageSize?: number;
    /**
     * Indicates if navigation is looped from the last to the first element.
     * @default false
     */
    loop?: boolean;
    /**
     * Indicates if canceling is allowed.
     * @default false
     */
    allowCancel?: boolean;
    /**
     * Message when selection is canceled.
     * @default 'Canceled.'
     */
    cancelText?: string;
    /**
     * Message when the current node has no children.
     * @default 'No items available.'
     */
    emptyText?: string;
    /**
     * Indicates if multiple items can be selected.
     * @default false
     */
    multiple?: boolean;
    /**
     * Initial selection for the prompt.
     * For single selection mode: a single Item or value string
     * For multiple selection mode: an array of Items or value strings
     */
    initialSelection?: string | string[];
    /** Theme applied to the file selector. */
    theme?: PartialDeep<Theme<PromptTheme>>;
}

declare function treeSelector(config: PromptConfig & {
    multiple: true;
    allowCancel?: false;
}): Promise<string[]>;
declare function treeSelector(config: PromptConfig & {
    multiple: true;
    allowCancel: true;
}): Promise<string[] | null>;
declare function treeSelector(config: PromptConfig & {
    multiple?: false;
    allowCancel?: false;
}): Promise<string>;
declare function treeSelector(config: PromptConfig & {
    multiple?: false;
    allowCancel: true;
}): Promise<string | null>;

export { Status, treeSelector };
export type { Item, PromptConfig, PromptTheme, RenderContext, StatusType };
