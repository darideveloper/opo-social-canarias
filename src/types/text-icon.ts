import { icons } from '../data/icons.ts'

export type TextIconType = {
  iconName: keyof typeof icons
  text: string
  textVariant?: 'muted' | 'secondary'
}
