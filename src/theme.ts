import figures from "@inquirer/figures";
import chalk from "chalk";
import type { Item } from "#types/item";
import type { StatusType } from "#types/status";
import type { PromptTheme, RenderContext } from "#types/theme";

export const baseTheme: PromptTheme = {
	prefix: {
		idle: chalk.cyan("?"),
		done: chalk.green(figures.tick),
		canceled: chalk.red(figures.cross),
	},
	style: {
		active: (text: string) => chalk.cyan(text),
		selected: (text: string) => chalk.green(`${text} ${figures.tick}`),
		unselected: (text: string) => text,
		cancelText: (text: string) => chalk.red(text),
		emptyText: (text: string) => chalk.red(text),
		group: (text: string) => chalk.yellowBright(text),
		item: (text: string) => text,
		message: (text: string, _status: StatusType) => chalk.bold(text),
		help: (text: string) => chalk.italic.gray(text),
		answer: (text: string) => chalk.cyan(text),
	},
	hierarchySymbols: {
		branch: figures.lineUpDownRight + figures.line,
		leaf: figures.lineUpRight + figures.line,
	},
	help: {
		top: (allowCancel: boolean, multiple?: boolean) =>
			`(Press ${figures.arrowUp + figures.arrowDown} to navigate, ${figures.arrowLeft + figures.arrowRight} to navigate tree${
				multiple ? ", <space> to toggle selection" : ""
			}, <enter> to ${multiple ? "confirm" : "select"}${allowCancel ? ", <esc> or q to cancel" : ""})`,
		item: (multiple) =>
			multiple
				? "(Press <space> to toggle selection)"
				: "(Press <enter> to select)",
	},
	renderItem(item: Item, context: RenderContext) {
		const isLast = context.index === context.items.length - 1;
		let line =
			isLast && !context.loop
				? this.hierarchySymbols.leaf
				: this.hierarchySymbols.branch;

		if (context.isSelected) {
			line += this.style.selected(item.name);
		} else {
			if (context.isActive) {
				line += this.style.active(item.name);
			} else if (context.isSelected) {
				line += this.style.selected(item.name);
			} else if (item.children) {
				line += this.style.group(item.name);
			} else if (isLast && !context.loop) {
				line += this.style.unselected(item.name);
			} else {
				line += this.style.unselected(item.name);
			}
			line += "  ";
		}

		if (context.isActive) {
			const helpMessage = this.help.item(context.multiple);
			line += ` ${this.style.help(helpMessage)}`;
		}

		return line;
	},
};
