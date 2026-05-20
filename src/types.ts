import type { ReactNode } from 'react'

export type PhoneLengthEntry = {
  flagCode?: string
  country?: string
  phoneNumberLengthByCountry_phLengthMax?: number | null
  phoneNumberLengthByCountry_phLengthMin?: number | null
  phoneNumberLengthByCountry_phLength?: string | number | null
}

export type PhoneInputChangePayload = {
  value: string
  error: string | null
}

/** Extra classes per element (merged with built-in `rpi-*` classes) */
export type PhoneInputClassNames = {
  root?: string
  field?: string
  countryTrigger?: string
  input?: string
  error?: string
  errorWrap?: string
  dropdown?: string
  searchWrap?: string
  search?: string
  list?: string
  countryOption?: string
  empty?: string
}

export type PhoneInputTheme = 'light' | 'dark' | 'auto'

export type PhoneInputProps = {
  /** Controlled value. Omit for uncontrolled mode (use with `defaultValue`). */
  value?: string
  /** Initial value when uncontrolled (default: `''`) */
  defaultValue?: string
  onChange: (val: PhoneInputChangePayload) => void
  error?: string | null
  disabled?: boolean
  /** ISO country code for initial selection (default: `us`) */
  defaultCountry?: string
  /**
   * Color theme: `auto` follows OS (prefers-color-scheme),
   * `light` / `dark` force a mode.
   */
  theme?: PhoneInputTheme
  /** Extra class on root wrapper */
  className?: string
  /** Extra classes on individual parts */
  classNames?: PhoneInputClassNames
  /** Error text alignment (default: `left`) — works without Tailwind */
  errorAlign?: 'left' | 'center' | 'right'
  /**
   * Fully custom error UI. When set, replaces the default `<p>` error element.
   * `classNames.error` is ignored unless you use it inside your render.
   */
  renderError?: (props: {
    message: string
    error: string | null
    validationError: string | null
  }) => ReactNode
}
