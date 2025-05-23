import { ReactElement } from 'react';
import {
  render as rtlRender,
  RenderOptions,
  screen,
  fireEvent,
  waitFor,
  within,
  act,
  cleanup,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AllProviders from './TestProviders';

// Interface for the extended render result
interface CustomRenderResult extends ReturnType<typeof rtlRender> {
  user: ReturnType<typeof userEvent.setup>;
}

// Custom render function that includes the AllProviders wrapper
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
): CustomRenderResult {
  return {
    user: userEvent.setup(),
    ...rtlRender(ui, {
      wrapper: AllProviders,
      ...options,
    }),
  };
}

// Export specific functions from @testing-library/react
export { screen, fireEvent, waitFor, within, act, cleanup };

// Override the render method with our customized version
export { customRender as render };
