import { createContext } from 'react';

export const TestContext = createContext<any>(null);

function TestProvider({ children }: { children: React.ReactNode }) {
  return <TestContext.Provider value={{ test: true }}>{children}</TestContext.Provider>;
}

export default TestProvider;
