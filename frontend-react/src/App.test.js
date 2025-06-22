import { render, screen } from '@testing-library/react';
import App from './App';

// Đảm bảo React được import nếu JSX dùng trong mock
import React from 'react';

// Fake router
jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => <div>{children}</div>,
  Routes: ({ children }) => <div>{children}</div>,
  Route: () => <div>Route</div>,
  useNavigate: () => jest.fn(),
}));

test('renders camp rentals text', () => {
  render(<App />);
  const heading = screen.getByText(/camp rentals/i); // sửa theo tiêu đề trong StartPage của anh
  expect(heading).toBeInTheDocument();
});
