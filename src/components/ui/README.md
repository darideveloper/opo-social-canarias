# UI Components Library

A comprehensive collection of reusable React components built with TypeScript, Tailwind CSS, and modern React patterns. All components are designed to work seamlessly with Astro.

## 🚀 Features

- **TypeScript**: Full type safety with proper interfaces
- **Tailwind CSS**: Consistent styling with design system
- **Accessibility**: ARIA attributes and keyboard navigation
- **Error Handling**: Error boundaries for graceful failure
- **Loading States**: Built-in loading indicators
- **Form Validation**: Error states and validation support
- **Modern React**: Functional components with hooks
- **Astro Compatible**: Works perfectly with Astro SSR

## 📦 Components

### Core Components

#### Button
Multi-variant button component with loading states.

```tsx
import { Button } from './ui';

// Basic usage
<Button>Click me</Button>

// With variants
<Button variant="outline" size="lg">Large Outline</Button>

// Loading state
<Button loading loadingText="Saving...">Save</Button>

// As child component
<Button asChild>
  <a href="/link">Link Button</a>
</Button>
```

**Props:**
- `variant`: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
- `size`: 'default' | 'sm' | 'lg' | 'icon'
- `loading`: boolean
- `loadingText`: string
- `asChild`: boolean

#### Card
Container component with header and content sections.

```tsx
import { Card, CardHeader, CardTitle, CardContent } from './ui';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    Card content goes here
  </CardContent>
</Card>
```

#### Input
Form input with error state support.

```tsx
import { Input } from './ui';

// Basic input
<Input placeholder="Enter your email" />

// With error state
<Input 
  error 
  errorMessage="Email is required" 
  placeholder="Enter your email" 
/>
```

**Props:**
- `error`: boolean
- `errorMessage`: string
- All standard HTML input attributes

#### Label
Form label component with proper accessibility.

```tsx
import { Label } from './ui';

<Label htmlFor="email">Email Address</Label>
```

### Form Components

#### Form
Form wrapper with consistent spacing.

```tsx
import { Form } from './ui';

<Form onSubmit={handleSubmit}>
  {/* form fields */}
</Form>
```

#### FormField
Field wrapper with label and error handling.

```tsx
import { FormField, Input } from './ui';

<FormField 
  label="Email" 
  error={emailError} 
  required
>
  <Input 
    type="email" 
    value={email} 
    onChange={setEmail} 
  />
</FormField>
```

### Utility Components

#### LoadingSpinner
Animated loading indicator.

```tsx
import { LoadingSpinner } from './ui';

<LoadingSpinner size="md" />
```

**Props:**
- `size`: 'sm' | 'md' | 'lg'

#### Skeleton
Loading placeholder component.

```tsx
import { Skeleton } from './ui';

<Skeleton className="h-4 w-full" />
<Skeleton className="h-8 w-32" />
```

#### ErrorBoundary
Error boundary for graceful error handling.

```tsx
import { ErrorBoundary } from './ui';

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

**Props:**
- `fallback`: ReactNode (custom error UI)
- `onError`: (error: Error, errorInfo: React.ErrorInfo) => void

### Advanced Components

#### Badge
Status indicator component.

```tsx
import { Badge } from './ui';

<Badge variant="default">Active</Badge>
<Badge variant="destructive">Error</Badge>
```

#### Avatar
User avatar with fallback support.

```tsx
import { Avatar, AvatarImage, AvatarFallback } from './ui';

<Avatar>
  <AvatarImage src="/avatar.jpg" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

#### Carousel
Image/content carousel component.

```tsx
import { Carousel, CarouselContent, CarouselItem } from './ui';

<Carousel>
  <CarouselContent>
    <CarouselItem>Slide 1</CarouselItem>
    <CarouselItem>Slide 2</CarouselItem>
  </CarouselContent>
</Carousel>
```

## 🎨 Design System

### Colors
- **Primary**: `#8b5cf6` (Vibrant purple)
- **Accent**: `#ff6b35` (Warm orange)
- **Background**: `#f5f3f0` (Warm creamy off-white)
- **Foreground**: `#4a3f3a` (Soft dark brown)
- **Destructive**: `#ef4444` (Red)

### Typography
- **Title Font**: 'Belleza' (serif)
- **Body Font**: 'Inter' (sans-serif)

### Spacing
- Consistent `space-y-4` for form spacing
- `min-h-screen` for full-height layouts
- Centered card layouts with proper padding

## 🔧 Usage with Astro

All components work seamlessly with Astro:

```astro
---
import { Button, Card, CardHeader, CardContent } from '../components/ui';
---

<Card>
  <CardHeader>
    <h2>Welcome</h2>
  </CardHeader>
  <CardContent>
    <Button client:load>Click me</Button>
  </CardContent>
</Card>
```

## 📝 Best Practices

1. **Import from index**: Use centralized imports
   ```tsx
   import { Button, Card } from './ui';
   ```

2. **Use Error Boundaries**: Wrap components that might fail
   ```tsx
   <ErrorBoundary>
     <YourComponent />
   </ErrorBoundary>
   ```

3. **Handle Loading States**: Use built-in loading props
   ```tsx
   <Button loading={isSubmitting}>Submit</Button>
   ```

4. **Form Validation**: Use error states for better UX
   ```tsx
   <Input error={!!error} errorMessage={error} />
   ```

5. **Accessibility**: Always provide proper labels and ARIA attributes

## 🧪 Testing

Components are designed to be easily testable:

```tsx
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole('button')).toHaveTextContent('Click me');
});
```

## 🚀 Migration Guide

### From Old Components

**Before:**
```tsx
import CardHeader from './ui/CardHeader';
import CardContent from './ui/CardContent';
```

**After:**
```tsx
import { CardHeader, CardContent } from './ui';
```

### Enhanced Features

**Button with loading:**
```tsx
// Old way
<Button disabled={loading}>
  {loading ? 'Loading...' : 'Submit'}
</Button>

// New way
<Button loading loadingText="Submitting...">
  Submit
</Button>
```

**Input with error:**
```tsx
// Old way
<input className={error ? 'border-red-500' : ''} />
{error && <p className="text-red-500">{error}</p>}

// New way
<Input error={!!error} errorMessage={error} />
```

## 📚 Examples

See the forms in `src/components/forms/` for real-world usage examples.

## 🤝 Contributing

When adding new components:

1. Follow the established patterns
2. Add proper TypeScript interfaces
3. Include JSDoc documentation
4. Add error boundary support
5. Test with Astro integration
6. Update this README

## 📄 License

This component library is part of the Socialia project.
