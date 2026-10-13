import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ErrorMessage } from '../components/ErrorMessage'

describe('ErrorMessage', () => {
  it('shows the title and error detail as an alert', () => {
    render(<ErrorMessage title="Unable to load files" error={new Error('boom')} />)

    expect(screen.getByRole('alert')).toHaveTextContent('Unable to load files')
    expect(screen.getByText('boom')).toBeInTheDocument()
  })

  it('calls onRetry when Retry is clicked', async () => {
    const onRetry = jest.fn()
    render(<ErrorMessage title="Failed" onRetry={onRetry} />)

    await userEvent.click(screen.getByRole('button', { name: 'Retry' }))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })
})
