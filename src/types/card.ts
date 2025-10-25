import { icons } from "../libs/constants/icons"

export type CardType = {
  title: string
  iconWhite?: boolean
  textWhite?: boolean
  iconName?: keyof typeof icons
  class?: string
}
