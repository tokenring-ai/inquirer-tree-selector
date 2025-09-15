import type {KeypressEvent} from "@inquirer/core";
import {isDownKey, isEnterKey, isSpaceKey, isUpKey} from "@inquirer/core";

/** Check if the given key is the Escape key. */
export function isEscapeKey(key: KeypressEvent): boolean {
  return key.name === "escape" || key.name === "q";
}

export function isLeftKey(key: KeypressEvent): boolean {
  return key.name === "left";
}

export function isRightKey(key: KeypressEvent): boolean {
  return key.name === "right";
}

export function isPageUp(key: KeypressEvent): boolean {
  return key.name === "pageup";
}

export function isPageDown(key: KeypressEvent): boolean {
  return key.name === "pagedown";
}

// This re-export exists only to keep the related functions in the same file.
export {isDownKey, isEnterKey, isSpaceKey, isUpKey};
