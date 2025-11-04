import { render, screen } from '@testing-library/react';
import App from './App';

test('renders SustainAI Materials header', () => {
  render(<App />);
  const headerElement = screen.getByText(/SustainAI Materials/i);
  expect(headerElement).toBeInTheDocument();
});
