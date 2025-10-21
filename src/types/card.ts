import { icons } from "../data/icons"

export type CardType = {
  title: string
  iconWhite?: boolean
  textWhite?: boolean
  iconName?: keyof typeof icons
  class?: string
}
