export type Item = {
	/** Name to display in the list */
	name: string;
	/** Value to put in selection list - if not provided, the item is not selectable */
	value?: string;
	/** Children of this item (if any) */
	children?: Item[] | ((parent?: Item) => Promise<Item[]> | Item[]);
};
