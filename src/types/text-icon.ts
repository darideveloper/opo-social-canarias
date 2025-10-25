import { icons } from '../libs/constants/icons.ts'

export type TextIconType = {
  iconName: keyof typeof icons
  text: string
  textVariant?: 'muted' | 'secondary'
}
