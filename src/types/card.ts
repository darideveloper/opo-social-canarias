import { icons } from "../data/card"

export type CardProps = {
  title: string
  iconWhite?: boolean
  textWhite?: boolean
  iconName?: keyof typeof icons
  class?: string
}
