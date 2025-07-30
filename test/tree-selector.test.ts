import { describe, it, expect, vi } from 'vitest'
import { treeSelector } from '../src'
import { render } from '@inquirer/testing'

const tree = [
  {
    name: 'A',
    value: 'a',
    children: () => Promise.resolve([
      { name: 'A1', value: 'a1' },
      { name: 'A2', value: 'a2' },
    ]),
  },
  {
    name: 'B',
    value: 'b',
    children: () => Promise.resolve([
      { name: 'B1', value: 'b1' },
      { name: 'B2', value: 'b2' },
    ]),
  },
]

describe('treeSelector', () => {
  it('should select a single item', async () => {
    const { answer, events, getScreen } = await render(
      treeSelector,
      {
        message: 'Select an item',
        tree,
      }
    )

    events.keypress('down')
    await Promise.resolve()
    events.keypress('enter')
    await Promise.resolve()

    await expect(answer).resolves.toEqual('a1')
    expect(getScreen()).toMatchSnapshot()
  })

  it('should select multiple items', async () => {
    const { answer, events, getScreen } = await render(
      treeSelector,
      {
        message: 'Select an item',
        tree,
        multiple: true,
      }
    )

    events.keypress('down')
    await Promise.resolve()
    events.keypress('space')
    await Promise.resolve()
    events.keypress('down')
    await Promise.resolve()
    events.keypress('space')
    await Promise.resolve()
    events.keypress('enter')
    await Promise.resolve()

    await expect(answer).resolves.toEqual(['a1', 'a2'])
    expect(getScreen()).toMatchSnapshot()
  })

  it('should show enabled leafs', async () => {
    const { answer, events, getScreen } = await render(
      treeSelector,
      {
        message: 'Select an item',
        tree,
        multiple: true,
        initialSelection: ['a1'],
      }
    )

    events.keypress('enter')
    await Promise.resolve()

    await expect(answer).resolves.toEqual(['a1'])
    expect(getScreen()).toMatchSnapshot()
  })
})
