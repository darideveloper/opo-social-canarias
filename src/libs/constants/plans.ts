import type { PricingCardType } from '../../types/pricing-card'
import type { TextIconType } from '../../types/text-icon'

// Extend PricingCardType with TextIconType (features)
type PricingCardTypeWithFeatures = PricingCardType & {
  features: TextIconType[]
}

// Data
export const plansData = [
  {
    name: 'Plan Mensual',
    description: 'Para empezar a prepararte sin ataduras',
    price: '35',
    btnText: 'Empezar ahora',
    tagText: '',
    important: false,
    footerText: '',
    features: [
      {
        iconName: 'check',
        text: 'Temario completo y actualizado',
        textVariant: 'muted',
      },
      {
        iconName: 'check',
        text: 'Temario completo y actualizado',
        textVariant: 'muted',
      },
      {
        iconName: 'check',
        text: 'Widget de convocatorias',
        textVariant: 'muted',
      },
      {
        iconName: 'check',
        text: 'Generador de casos y tests (limitado)',
        textVariant: 'muted',
      },
      {
        iconName: 'check',
        text: 'Buscador de recursos con AI (limitado)',
        textVariant: 'muted',
      },
    ],
  },
  {
    name: 'Plan Mensual Pro',
    description: 'Desbloquea todo el poder de la IA sin permanencia',
    price: '57',
    btnText: 'Elegir Plan Pro',
    tagText: 'MÁS POPULAR',
    important: true,
    footerText: '',
    features: [
      {
        iconName: 'check',
        text: 'Todo lo del plan Mensual',
        textVariant: 'muted',
      },
      {
        iconName: 'bolt',
        text: 'Generación con IA ilimitada',
        textVariant: 'secondary',
      },
      {
        iconName: 'bookOpen',
        text: 'Acceso a exámenes de convocatorias anteriores',
        textVariant: 'secondary',
      },
      {
        iconName: 'shield',
        text: 'Descarga de todo el temario en PDF',
        textVariant: 'secondary',
      },
    ],
  },
  {
    name: 'Plan Anual Pro',
    description: 'El compromiso definitivo con tu plaza. El mejor valor.',
    price: '570',
    btnText: 'Aportar por mi futuro',
    tagText: 'AHORRA 2 MESES',
    important: false,
    footerText:
      'La inversión mas completa, para asegurar tu preparación, con las mejores herramientas del mercado.',
    features: [
      {
        iconName: 'check',
        text: 'Todo lo del plan Mensual Pro',
        textVariant: 'muted',
      },
      {
        iconName: 'bolt',
        text: 'Generación con IA ilimitada',
        textVariant: 'secondary',
      },
      {
        iconName: 'bookOpen',
        text: 'Acceso a exámenes de convocatorias anteriores',
        textVariant: 'secondary',
      },
      {
        iconName: 'chart',
        text: 'Descarga de todo el temario en PDF',
        textVariant: 'secondary',
      },
    ],
  },
] as PricingCardTypeWithFeatures[]
