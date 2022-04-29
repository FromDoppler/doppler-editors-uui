import { act, render, screen } from "@testing-library/react";
import { AppServices } from "../abstractions";
import { SingletonEditorProvider, useSingletonEditor } from "./SingletonEditor";
import { AppServicesProvider } from "./AppServicesContext";
import { QueryClient, QueryClientProvider } from "react-query";
import { Field } from "../abstractions/doppler-rest-api-client";
import { TestDopplerIntlProvider } from "./i18n/TestDopplerIntlProvider";
import { Content } from "../abstractions/domain/content";
import { useEffect, useState } from "react";

const DoubleEditor = ({ setEditorState, hidden, ...otherProps }: any) => {
  useEffect(() => {
    setEditorState({
      unlayer: {
        loadDesign: jest.fn(),
        exportHtml: (cb: any) => {
          cb({
            design: {},
            html: "",
          });
        },
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      },
      isLoaded: true,
    });
  }, []);

  const containerStyle = {
    height: "100%",
    display: hidden ? "none" : "flex",
  };
  return <div style={containerStyle} {...otherProps} />;
};

jest.mock("./Editor", () => {
  return { Editor: DoubleEditor };
});

const singletonEditorTestId = "singleton-editor-test";

const defaultAppServices = {
  appConfiguration: {
    unlayerProjectId: 12345,
    unlayerEditorManifestUrl: "unlayerEditorManifestUrl",
    loaderUrl: "loaderUrl",
  },
  appSessionStateAccessor: {
    getCurrentSessionState: () => ({
      status: "authenticated",
      unlayerUser: {
        id: "unlayerUserId",
        signature: "unlayerUserSignature",
      },
    }),
  },
  dopplerRestApiClient: {
    getFields: () => Promise.resolve({ success: true, value: [] as Field[] }),
  },
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
  },
});

let generatedContentCounter = 0;
const generateNewContent: () => Content = () => ({
  htmlContent: `Content #${generatedContentCounter++}`,
  type: "unlayer",
  design: {
    body: {
      rows: [],
    },
  },
});

describe(`${SingletonEditorProvider.name}`, () => {
  // Arrange
  const appServices = defaultAppServices as AppServices;

  const DemoComponent = ({ onSave }: { onSave: () => void }) => {
    const [initialContent, setInitialContent] = useState<Content | undefined>();
    const { save } = useSingletonEditor(
      {
        initialContent,
        onSave,
      },
      [initialContent, onSave]
    );

    const changeInitialContent = () => {
      setInitialContent(generateNewContent());
    };

    return (
      <>
        <button onClick={changeInitialContent}>change initial content</button>
        <button onClick={save}>save content</button>
      </>
    );
  };

  const WrapperSingletonProviderTest = ({ children }: any) => (
    <QueryClientProvider client={queryClient}>
      <AppServicesProvider appServices={appServices}>
        <TestDopplerIntlProvider>
          <SingletonEditorProvider data-testid="singleton-editor-test">
            {children}
          </SingletonEditorProvider>
        </TestDopplerIntlProvider>
      </AppServicesProvider>
    </QueryClientProvider>
  );

  it("should hide Editor when initialContent is undefined", () => {
    // Act
    render(
      <WrapperSingletonProviderTest>
        <DemoComponent onSave={() => {}} />
      </WrapperSingletonProviderTest>
    );
    // Assert
    const editorEl = screen.getByTestId(singletonEditorTestId);
    expect(editorEl.style.display).toBe("none");
  });

  it("should show Editor when content is loaded", () => {
    // Act
    render(
      <WrapperSingletonProviderTest>
        <DemoComponent onSave={() => {}} />
      </WrapperSingletonProviderTest>
    );
    const loadInitialContentBtn = screen.getByText("change initial content");
    act(() => {
      loadInitialContentBtn.click();
    });
    // Assert
    const editorEl = screen.getByTestId(singletonEditorTestId);
    expect(editorEl.style.display).toBe("flex");
  });

  it("should save content when save event is fire", () => {
    // Arrange
    const onSaveFn = jest.fn();
    // Act
    render(
      <WrapperSingletonProviderTest>
        <DemoComponent onSave={onSaveFn} />
      </WrapperSingletonProviderTest>
    );
    const changeInitialContentBtn = screen.getByText("change initial content");
    act(() => {
      // eventListener()
      changeInitialContentBtn.click();
    });
    const buttonSave = screen.getByText("save content");
    buttonSave.click();
    // Assert
    expect(onSaveFn).toHaveBeenCalledTimes(1);
  });
});
