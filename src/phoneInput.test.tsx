import { render, screen, fireEvent } from '@testing-library/react'
import PhoneInputDefault, { PhoneInput as PhoneInputNamed } from './index'

const PhoneInput = PhoneInputDefault

describe('PhoneInput', () => {
  it('supports default and named exports from index', () => {
    expect(PhoneInputDefault).toBe(PhoneInputNamed)
  })

  it('renders default country code', () => {
    render(<PhoneInput value='+21612345678' onChange={() => {}} />)
    expect(screen.getByText(/US/i)).toBeInTheDocument()
  })

  it('calls onChange when input value changes', () => {
    const handleChange = vi.fn()

    render(<PhoneInput value='' onChange={handleChange} />)

    const input = screen.getByPlaceholderText(/\+1/)
    fireEvent.change(input, { target: { value: '+33123456789' } })

    expect(handleChange).toHaveBeenCalledTimes(1)
    expect(handleChange).toHaveBeenCalledWith({
      value: '+33123456789',
      error: null,
    })
  })

  it('allows typing in uncontrolled mode', () => {
    const handleChange = vi.fn()

    render(<PhoneInput onChange={handleChange} defaultCountry='fr' />)

    const input = screen.getByPlaceholderText(/\+33/)
    fireEvent.change(input, { target: { value: '+33123456789' } })

    expect(input).toHaveValue('+33123456789')
    expect(handleChange).toHaveBeenCalledWith({
      value: '+33123456789',
      error: null,
    })
  })

  it('correctly validates Tunisian phone numbers', () => {
    const handleChange = vi.fn()

    render(<PhoneInput value='' onChange={handleChange} />)

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '+21655667788' } })

    expect(handleChange).toHaveBeenCalledTimes(1)
    expect(handleChange).toHaveBeenCalledWith({
      value: '+21655667788',
      error: null,
    })
  })
})
