# @rqdhw3n/react-phone-input

International phone input for React with country selector, search, and per-country length validation.

## Install

```bash
npm install @rqdhw3n/react-phone-input
```

Peer dependencies: `react` and `react-dom` (18+).

## Styles (required)

Import styles once in your app entry (Vite, CRA, Next.js client component):

```tsx
import '@rqdhw3n/react-phone-input/styles.css'
```

Supported paths (all map to the same file):

- `@rqdhw3n/react-phone-input/styles.css` (recommended)
- `@rqdhw3n/react-phone-input/style.css`
- `@rqdhw3n/react-phone-input/dist/index.css` (legacy)

Do **not** import deep paths that are not listed in `package.json` `exports`.

## Usage

### Controlled (recommended for forms)

You **must** update `value` in `onChange`. If `value=""` never changes, typing will not work.

```tsx
import { useState } from 'react'
import PhoneInput from '@rqdhw3n/react-phone-input'
import '@rqdhw3n/react-phone-input/styles.css'

function Form() {
  const [phone, setPhone] = useState('')

  return (
    <PhoneInput
      value={phone}
      onChange={({ value }) => setPhone(value)}
      defaultCountry="fr"
    />
  )
}
```

### Uncontrolled (quick tests)

Omit `value` — the component manages its own state:

```tsx
<PhoneInput onChange={(val) => console.log(val)} defaultCountry="tn" />
```

### Default import

```tsx
import PhoneInput from '@rqdhw3n/react-phone-input'
// or named:
import { PhoneInput } from '@rqdhw3n/react-phone-input'
```

## Theme (light / dark / auto)

| `theme` | Behavior |
|---------|----------|
| `"auto"` (default) | Follows OS `prefers-color-scheme` |
| `"light"` | Always light |
| `"dark"` | Always dark |

```tsx
<PhoneInput
  value={phone}
  onChange={({ value }) => setPhone(value)}
  defaultCountry="tn"
  theme="dark"
/>
```

### Override colors with CSS variables

```css
/* Custom brand on a wrapper */
.my-phone.rpi-root {
  --rpi-bg: #0f172a;
  --rpi-bg-muted: #1e293b;
  --rpi-text: #e2e8f0;
  --rpi-text-muted: #94a3b8;
  --rpi-border: #334155;
  --rpi-border-focus: #38bdf8;
  --rpi-error: #f87171;
  --rpi-selected: #818cf8;
}
```

```tsx
<PhoneInput className="my-phone" theme="dark" ... />
```

Available variables: `--rpi-bg`, `--rpi-bg-muted`, `--rpi-text`, `--rpi-text-muted`, `--rpi-border`, `--rpi-border-focus`, `--rpi-error`, `--rpi-selected`, `--rpi-shadow`, `--rpi-focus-ring`, `--rpi-error-ring`.

## Custom classes

Add your own classes on each part. They are **merged** with built-in `rpi-*` classes (not replaced).

```tsx
<PhoneInput
  value={phone}
  onChange={({ value }) => setPhone(value)}
  defaultCountry="tn"
  theme="dark"
  className="w-full max-w-md"
  classNames={{
    field: 'rounded-xl border-2',
    input: 'text-base font-medium',
    dropdown: 'rounded-xl shadow-2xl',
    countryOption: 'py-3',
    error: 'text-sm italic',
  }}
/>
```

| Prop | Element |
|------|---------|
| `className` | Root wrapper |
| `classNames.root` | Root (merged with `className`) |
| `classNames.field` | Input container (flag + phone field) |
| `classNames.countryTrigger` | Country selector button |
| `classNames.input` | Phone `<input>` |
| `classNames.error` | Default error `<p>` |
| `classNames.errorWrap` | Wrapper when using `renderError` |
| `classNames.dropdown` | Country list panel |
| `classNames.searchWrap` | Search bar container in dropdown |
| `classNames.search` | Search `<input>` in dropdown |
| `classNames.list` | Country `<ul>` |
| `classNames.countryOption` | Each country row button |
| `classNames.empty` | "No results found" row |

> **Note:** Tailwind classes like `text-left` on `className` only work if Tailwind is installed in your app. Prefer `errorAlign` or `renderError` for error layout (see below).

## Error message

The component shows validation errors automatically (e.g. wrong length per country). You can also pass an external error via the `error` prop.

### Why `text-left` on `className` does not align the error

1. **`text-left` is a Tailwind class** — without Tailwind in your project, it has no effect.
2. **Parent styles** — Vite/React templates often use `#root { text-align: center }`, which centers all children.
3. **Wrong target** — putting `text-left` on the root does not always override inherited alignment on the error `<p>`.

### Align error text (`errorAlign`)

Works **without Tailwind** — uses native CSS in the package.

```tsx
<PhoneInput
  value={phone}
  onChange={({ value }) => setPhone(value)}
  defaultCountry="tn"
  theme="dark"
  errorAlign="left"   // default
  // errorAlign="center"
  // errorAlign="right"
  classNames={{ error: 'text-sm italic' }}
/>
```

### Fully custom error UI (`renderError`)

Replace the default error element with your own JSX:

```tsx
<PhoneInput
  value={phone}
  onChange={({ value }) => setPhone(value)}
  defaultCountry="tn"
  theme="dark"
  renderError={({ message, error, validationError }) => (
    <div className="mt-1 flex items-start gap-2 text-left text-red-400 text-xs">
      <span aria-hidden>⚠</span>
      <span>{message}</span>
    </div>
  )}
/>
```

`renderError` receives:

| Property | Description |
|----------|-------------|
| `message` | Text shown to the user (`error` prop or internal validation) |
| `error` | External error from `error` prop |
| `validationError` | Internal validation message |

When `renderError` is set, `classNames.error` is **not** applied automatically — add your own classes inside the render function.

### External error prop

```tsx
const [phone, setPhone] = useState('')
const [formError, setFormError] = useState<string | null>(null)

<PhoneInput
  value={phone}
  onChange={({ value, error }) => {
    setPhone(value)
    setFormError(error)
  }}
  error={formError}
/>
```

## Complete example (dark theme + custom styles)

```tsx
import { useState } from 'react'
import PhoneInput from '@rqdhw3n/react-phone-input'
import '@rqdhw3n/react-phone-input/styles.css'

function App() {
  const [phone, setPhone] = useState('')

  return (
    <div style={{ padding: 40, background: '#111', minHeight: '100vh' }}>
      <h1 style={{ color: '#fff' }}>Test Phone Input</h1>

      <PhoneInput
        value={phone}
        onChange={({ value }) => setPhone(value)}
        defaultCountry="tn"
        theme="dark"
        errorAlign="left"
        className="w-full max-w-md"
        classNames={{
          field: 'rounded-xl border-2',
          input: 'text-base font-medium',
          dropdown: 'rounded-xl shadow-2xl',
          countryOption: 'py-3',
          error: 'text-sm italic',
        }}
      />

      <p style={{ color: '#9ca3af', marginTop: 8 }}>Value: {phone}</p>
    </div>
  )
}

export default App
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | — | Controlled value. **Must** be updated in `onChange` |
| `defaultValue` | `string` | `''` | Initial value when `value` is omitted (uncontrolled) |
| `onChange` | `(val: { value: string; error: string \| null }) => void` | — | Called on input or country change |
| `error` | `string \| null` | — | External error message (shown in addition to validation) |
| `disabled` | `boolean` | `false` | Disables input and country selector |
| `defaultCountry` | `string` | `'us'` | Initial country ISO code (e.g. `"tn"`, `"fr"`) |
| `theme` | `'light' \| 'dark' \| 'auto'` | `'auto'` | Color theme |
| `className` | `string` | `''` | Extra class on root wrapper |
| `classNames` | `PhoneInputClassNames` | — | Extra classes per part |
| `errorAlign` | `'left' \| 'center' \| 'right'` | `'left'` | Error text alignment (native CSS) |
| `renderError` | `(props) => ReactNode` | — | Custom error UI (replaces default `<p>`) |

## Utilities

```ts
import {
  countries,
  getCountryByLabelOrCode,
  getCountryDisplay,
  validatePhoneLength,
} from '@rqdhw3n/react-phone-input'
```

## Troubleshooting

| Problem | Cause | Solution |
|---------|--------|----------|
| Cannot type in input | Controlled `value=""` never updated | Use `useState` and `setPhone(value)` in `onChange` |
| `text-left` has no effect | No Tailwind or parent `text-align: center` | Use `errorAlign="left"` or `renderError` |
| Error message centered | Inherited from `#root` or parent | Use `errorAlign` or `renderError` with `text-align: left` |
| Invisible country names in dropdown | Dark app + light dropdown + inherited white text | Use `theme="dark"` or CSS variables |
| `does not provide export named 'default'` | Old package version | Upgrade to `>=1.0.2` |
| CSS import fails in Vite | Wrong import path | Use `@rqdhw3n/react-phone-input/styles.css` |
| `No matching version found` | npm propagation delay after publish | Retry after a few minutes or `npm cache clean --force` |

## Framework notes

| Tool | Notes |
|------|--------|
| **Vite** | `import PhoneInput from '...'` + CSS in `main.tsx`; use `useState` for controlled mode |
| **Next.js** | Client Component (`'use client'`); import CSS in layout or component |
| **CRA** | CSS import in `index.tsx` |
| **Node ESM** | JS import works; CSS needs a bundler |

## Development

```bash
cd react-phone-input
npm install
npm run build
npm test
```

## Publish

```bash
npm publish --access public --otp=YOUR_CODE
```
