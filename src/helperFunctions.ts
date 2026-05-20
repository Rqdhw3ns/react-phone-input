import React from 'react'
import { countries, type Country } from './constants'
import type { PhoneLengthEntry } from './types'

export const getCleanNumber = (raw: string): string => raw.replace(/\s/g, '')

export const applyDialCode = (country: Country, currentValue: string): string => {
  const clean = currentValue.replace(/^\+?\d+/, '')
  return `+${country.dialCode}${clean}`
}

export const validatePhoneLength = (input: string, country: Country): string | null => {
  const prefix = `+${country.dialCode}`
  const rest = input.slice(prefix.length)

  if (!input.startsWith(prefix)) {
    return `Phone number must start with ${prefix}`
  }

  if (!/^\d+$/.test(rest)) {
    return 'Please enter digits only.'
  }

  const phoneLength = rest.length

  if (country.phoneLengths && country.phoneLengths.length > 0) {
    if (!country.phoneLengths.includes(phoneLength)) {
      return `Phone number must be ${country.phoneLengths.join(' or ')} digits`
    }
    return null
  }

  if (country.phoneLengthMin && phoneLength < country.phoneLengthMin) {
    return `Phone number must be at least ${country.phoneLengthMin} digits`
  }

  if (country.phoneLengthMax && phoneLength > country.phoneLengthMax) {
    return `Phone number must not exceed ${country.phoneLengthMax} digits`
  }

  return null
}

export const findCountryByDialCode = (
  input: string,
  currentCountry?: Country | null,
): Country | null => {
  const digits = input.replace(/^\+/, '')

  if (currentCountry && currentCountry.dialCode.toString().startsWith(digits)) {
    return currentCountry
  }

  const sorted = [...countries].sort(
    (a, b) => b.dialCode.toString().length - a.dialCode.toString().length,
  )

  const matches: Country[] = []
  for (const c of sorted) {
    if (digits.startsWith(c.dialCode.toString())) {
      matches.push(c)
    }
  }

  if (matches.length === 0) {
    return null
  }

  if (matches.length > 1) {
    if (matches[0].dialCode === 1) {
      const usa = matches.find((c) => c.code.toLowerCase() === 'us')
      if (usa) {
        return usa
      }
    }
    return matches[0]
  }

  return matches[0]
}

export const parsePhoneLengths = (
  entry: PhoneLengthEntry,
): { min?: number; max?: number; lengths?: number[] } => {
  const raw = entry.phoneNumberLengthByCountry_phLength
  if (!raw) return {}

  if (typeof raw === 'string') {
    if (raw.includes('to')) {
      const [min, max] = raw.split('to').map((v) => parseInt(v.trim(), 10))
      return { min, max }
    }

    if (raw.includes('or') || raw.includes(',')) {
      const numbers = raw
        .split(/or|,/)
        .map((v) => parseInt(v.trim(), 10))
        .filter((n) => !isNaN(n))
      return { lengths: numbers }
    }

    if (raw.includes('+')) {
      const last = raw.split('+').pop()?.trim()
      const len = last ? parseInt(last, 10) : undefined
      return { lengths: len ? [len] : undefined }
    }
  }

  if (typeof raw === 'number') {
    return { min: raw, max: raw }
  }

  return {}
}

export const createSearchChangeHandler =
  (setSearch: (term: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

export const createHandleSelect = (
  setSelected: (country: Country) => void,
  setIsOpen: (open: boolean) => void,
  setSearch: (search: string) => void,
  setValidationError: (error: string | null) => void,
  onChange: (result: { value: string; error: string | null }) => void,
  value: string,
  inputRef: React.RefObject<HTMLInputElement | null>,
) => {
  return (country: Country) => {
    setSelected(country)

    const full = applyDialCode(country, value)

    setIsOpen(false)
    setSearch('')

    requestAnimationFrame(() => {
      const input = inputRef.current
      if (!input) return

      input.focus()

      const len = input.value.length
      input.setSelectionRange(len, len)
    })

    if (full) {
      const validationResult = validatePhoneLength(full, country)
      setValidationError(validationResult)
      onChange({ value: full, error: validationResult })
    } else {
      setValidationError(null)
      onChange({ value: full, error: null })
    }
  }
}

export const createHandleInput = (
  setSelected: (country: Country) => void,
  setValidationError: (error: string | null) => void,
  onChange: (result: { value: string; error: string | null }) => void,
  selected: Country,
) => {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = getCleanNumber(e.target.value)
    let currentCountry = selected

    if (input.startsWith('+')) {
      const detected = findCountryByDialCode(input, selected)
      if (detected) {
        const currentDialCode = selected.dialCode.toString()
        const digits = input.replace(/^\+/, '')

        if (detected.code !== selected.code && !digits.startsWith(currentDialCode)) {
          setSelected(detected)
          currentCountry = detected
        } else if (detected.code === selected.code) {
          currentCountry = selected
        }
      }
    }

    if (input) {
      const validationResult = validatePhoneLength(input, currentCountry)
      setValidationError(validationResult)
      onChange({ value: input, error: validationResult })
    } else {
      setValidationError(null)
      onChange({ value: input, error: null })
    }
  }
}

export const createFilteredCountries = (countryList: Country[], search: string) => {
  return countryList.filter((country) => {
    const term = search.toLowerCase()
    return (
      country.label.toLowerCase().includes(term) ||
      country.code.toLowerCase().includes(term) ||
      country.dialCode.toString().startsWith(term)
    )
  })
}

export const createHandleToggleDropdown = (
  disabled: boolean,
  setIsOpen: (value: boolean | ((prev: boolean) => boolean)) => void,
) => {
  return function handleToggleDropdown() {
    if (!disabled) {
      setIsOpen((prev) => !prev)
    }
  }
}

export const createCountrySelectHandler = (handleSelect: (country: Country) => void) => {
  return function countrySelectHandler(country: Country) {
    return function onClickHandler() {
      handleSelect(country)
    }
  }
}

export const getDefaultCountry = (
  countryList: typeof countries,
  defaultCountryCode = 'us',
): Country => {
  const normalized = defaultCountryCode.toLowerCase()
  const match = countryList.find((c) => c.code.toLowerCase() === normalized)
  return match ?? countryList[0]
}
