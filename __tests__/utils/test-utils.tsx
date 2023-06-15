import React from 'react';
import { render } from '@testing-library/react';
import { SWRConfig } from 'swr';

const Wrapper = ({ children }: any) => {
  return (
    <SWRConfig
      value={{
        provider: () => new Map(),
        dedupingInterval: 0,
        fetcher: (...args: [any]) =>
          fetch(...args).then(async res => ({
            data: await res.json(),
            headers: res.headers,
          })),
      }}
    >
      {children}
    </SWRConfig>
  );
};

const customRender = (ui: any, options?: any) =>
  render(ui, { wrapper: Wrapper, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
