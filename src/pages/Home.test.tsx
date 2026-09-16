import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Home from './Home'

function renderHome() {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  )
}

describe('Home page', () => {
  it('renders the hero headline from the brand brief', () => {
    renderHome()
    expect(screen.getByText(/One workbench\./)).toBeInTheDocument()
    expect(screen.getByText(/Every tool you need\./)).toBeInTheDocument()
  })

  it('renders a search input', () => {
    renderHome()
    expect(screen.getByPlaceholderText('Search tools...')).toBeInTheDocument()
  })

  it('renders all 7 category filter chips plus "All"', () => {
    renderHome()
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'YouTube Creator Tools' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Text & Writing Utilities' })).toBeInTheDocument()
  })

  it('filters the visible tools when searching', async () => {
    const user = userEvent.setup()
    renderHome()
    await user.type(screen.getByPlaceholderText('Search tools...'), 'Slug Generator')
    expect(screen.getByText('Slug Generator')).toBeInTheDocument()
    expect(screen.queryByText('Word Counter & Reading Time Estimator')).not.toBeInTheDocument()
  })
})
