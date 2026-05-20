import { useState, useRef, useEffect, useCallback } from 'react'
import { ChevronDown } from 'lucide-react'
import { countries, type Country } from './constants'
import {
  createHandleSelect,
  createHandleInput,
  createFilteredCountries,
  createHandleToggleDropdown,
  createCountrySelectHandler,
  createSearchChangeHandler,
  getDefaultCountry,
} from './helperFunctions'
import type { PhoneInputProps, PhoneInputChangePayload } from './types'
import { cn } from './cn'

const themeClassMap = {
  light: 'rpi-light',
  dark: 'rpi-dark',
  auto: '',
} as const

export default function PhoneInput({
  value,
  defaultValue = '',
  onChange,
  error,
  disabled,
  defaultCountry = 'us',
  theme = 'auto',
  className = '',
  classNames = {},
  errorAlign = 'left',
  renderError,
}: PhoneInputProps) {
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = useState(defaultValue)
  const currentValue = isControlled ? value : internalValue

  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<Country>(() =>
    getDefaultCountry(countries, defaultCountry),
  )
  const [validationError, setValidationError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  const hasError = Boolean(error || validationError)
  const displayError = error || validationError

  const emitChange = useCallback(
    (result: PhoneInputChangePayload) => {
      if (!isControlled) {
        setInternalValue(result.value)
      }
      onChange(result)
    },
    [isControlled, onChange],
  )

  const handleSelect = createHandleSelect(
    setSelected,
    setIsOpen,
    setSearch,
    setValidationError,
    emitChange,
    currentValue,
    inputRef,
  )

  const handleInput = createHandleInput(setSelected, setValidationError, emitChange, selected)
  const handleToggleDropdown = createHandleToggleDropdown(disabled ?? false, setIsOpen)
  const filteredCountries = createFilteredCountries(countries, search)
  const countrySelectHandler = createCountrySelectHandler(handleSelect)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div
      className={cn('rpi-root', themeClassMap[theme], className, classNames.root)}
    >
      <div
        className={cn(
          'rpi-field',
          hasError && 'rpi-field--error',
          disabled && 'rpi-field--disabled',
          classNames.field,
        )}
      >
        <button
          type='button'
          className={cn('rpi-country-trigger', classNames.countryTrigger)}
          onClick={handleToggleDropdown}
          disabled={disabled}
          aria-expanded={isOpen}
          aria-haspopup='listbox'
        >
          <img src={selected.flagUrl} alt={selected.code} className='rpi-flag' />
          <span className='rpi-country-code'>{selected.code.toUpperCase()}</span>
          <ChevronDown
            className={cn('rpi-chevron', isOpen && 'rpi-chevron--open')}
            aria-hidden
          />
        </button>

        <input
          id='phone'
          type='tel'
          className={cn('rpi-input', classNames.input)}
          placeholder={`+${selected.dialCode} 123456789`}
          value={currentValue}
          onChange={handleInput}
          disabled={disabled}
          ref={inputRef}
        />
      </div>

      {displayError &&
        (renderError ? (
          <div className={cn('rpi-error-wrap', classNames.errorWrap)}>
            {renderError({
              message: displayError,
              error: error ?? null,
              validationError,
            })}
          </div>
        ) : (
          <p
            className={cn(
              'rpi-error',
              errorAlign === 'center' && 'rpi-error--center',
              errorAlign === 'right' && 'rpi-error--right',
              classNames.error,
            )}
          >
            {displayError}
          </p>
        ))}

      {isOpen && !disabled && (
        <div
          ref={dropdownRef}
          className={cn('rpi-dropdown', classNames.dropdown)}
          role='listbox'
        >
          <div className={cn('rpi-search-wrap', classNames.searchWrap)}>
            <input
              type='text'
              placeholder='Search country...'
              value={search}
              onChange={createSearchChangeHandler(setSearch)}
              className={cn('rpi-search', classNames.search)}
            />
          </div>

          <ul className={cn('rpi-list', classNames.list)}>
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => {
                const isSelected = country.code === selected.code
                return (
                  <li key={country.code}>
                    <button
                      type='button'
                      className={cn(
                        'rpi-country-option',
                        isSelected && 'rpi-country-option--selected',
                        classNames.countryOption,
                      )}
                      onClick={countrySelectHandler(country)}
                    >
                      <img src={country.flagUrl} alt={country.code} className='rpi-flag' />
                      <span className='rpi-country-label'>{country.label}</span>
                      <span className='rpi-dial-code'>+{country.dialCode}</span>
                    </button>
                  </li>
                )
              })
            ) : (
              <li className={cn('rpi-empty', classNames.empty)}>No results found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
