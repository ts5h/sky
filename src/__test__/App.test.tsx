import { render } from "@testing-library/react";

// Mock all external dependencies to avoid complex integration issues
jest.mock("../components/MarkovChainSound", () => ({
  MarkovChainSound: () => null,
}));

jest.mock("../components/Sky", () => ({
  Sky: () => <canvas data-testid="sky-canvas" width={4000} height={2500} />,
}));

jest.mock("../components/Menu/ReturnToHome", () => ({
  ReturnToHome: () => <div data-testid="return-to-home">Return Home</div>,
}));

jest.mock("../components/Menu/Footer", () => ({
  Footer: () => <div data-testid="footer">Footer</div>,
}));

// Now import the App component
import { App } from "../App";

describe("App Component", () => {
  test("renders app without crashing", () => {
    const { container } = render(<App />);
    
    // Check if the main app container is rendered
    const appElement = container.querySelector(".App");
    expect(appElement).toBeInTheDocument();
  });

  test("renders all main components", () => {
    render(<App />);
    
    // Check for mocked components
    expect(document.querySelector('[data-testid="sky-canvas"]')).toBeInTheDocument();
    expect(document.querySelector('[data-testid="return-to-home"]')).toBeInTheDocument();
    expect(document.querySelector('[data-testid="footer"]')).toBeInTheDocument();
  });

  test("app has correct structure", () => {
    const { container } = render(<App />);
    
    const appDiv = container.querySelector(".App");
    expect(appDiv).toBeInTheDocument();
    expect(appDiv?.children.length).toBe(3); // ReturnToHome, Sky, Footer (MarkovChainSound returns null)
  });
});
