import { act, render } from "@testing-library/react";
import { useCustomMediaLibraryBehavior } from "./useCustomMediaLibraryBehavior";
import { ImageItem } from "../../abstractions/domain/image-gallery";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
  },
});

const ContextWrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const createTestContext = () => {
  const selectImage = jest.fn();
  let currentCheckedItems: ReadonlySet<ImageItem>;
  let currentToggleCheckedImage: (item: ImageItem) => void;
  let currentSelectCheckedImage: (() => void) | null;

  const TestComponent = () => {
    const { checkedImages, toggleCheckedImage, selectCheckedImage } =
      useCustomMediaLibraryBehavior({ selectImage });
    currentToggleCheckedImage = toggleCheckedImage;
    currentCheckedItems = checkedImages;
    currentSelectCheckedImage = selectCheckedImage;

    return <></>;
  };

  return {
    TestComponent,
    selectImage,
    toggleCheckedImage: (item: ImageItem) =>
      act(() => currentToggleCheckedImage(item)),
    getCheckedItems: () => Array.from(currentCheckedItems),
    selectCheckedIsNull: () => currentSelectCheckedImage === null,
    selectCheckedImage: () => act(() => currentSelectCheckedImage?.()),
  };
};

describe(useCustomMediaLibraryBehavior.name, () => {
  it("should toggle checked items", () => {
    // Arrange
    const { TestComponent, getCheckedItems, toggleCheckedImage } =
      createTestContext();
    render(
      <ContextWrapper>
        <TestComponent />
      </ContextWrapper>
    );

    // Assert
    expect(getCheckedItems()).toEqual([]);

    // Act (new item)
    const item1 = { name: "name1", url: "url1" } as ImageItem;
    toggleCheckedImage(item1);

    // Assert
    expect(getCheckedItems()).toEqual([item1]);

    // Act (a new second item)
    const item2 = { name: "name2", url: "url2" } as ImageItem;
    toggleCheckedImage(item2);

    // Assert
    expect(getCheckedItems()).toEqual([item1, item2]);

    // Act (the first item again)
    toggleCheckedImage(item1);

    // Assert
    expect(getCheckedItems()).toEqual([item2]);

    // Act (a new item similar to previous one)
    const item3 = { name: "name2", url: "url2" } as ImageItem;
    toggleCheckedImage(item3);

    // Assert
    expect(getCheckedItems()).toEqual([item2, item3]);
  });

  it("should define selectCheckedImage when there is only one checked image", () => {
    // Arrange
    const {
      TestComponent,
      toggleCheckedImage,
      selectImage,
      selectCheckedImage,
      selectCheckedIsNull,
    } = createTestContext();
    render(
      <ContextWrapper>
        <TestComponent />
      </ContextWrapper>
    );
    const url = "url";
    toggleCheckedImage({ name: "name1", url } as ImageItem);

    // Act
    selectCheckedImage();

    // Assert
    expect(selectCheckedIsNull()).toBe(false);
    expect(selectImage).toBeCalledWith({ url });
  });

  it("should make selectCheckedImage null when there are no checked images", () => {
    // Arrange
    const { TestComponent, selectCheckedImage, selectCheckedIsNull } =
      createTestContext();
    render(
      <ContextWrapper>
        <TestComponent />
      </ContextWrapper>
    );

    // Act
    selectCheckedImage();

    // Assert
    expect(selectCheckedIsNull()).toBe(true);
  });

  it("should make selectCheckedImage null when there are more than a checked image", () => {
    // Arrange
    const {
      TestComponent,
      toggleCheckedImage,
      selectCheckedImage,
      selectCheckedIsNull,
    } = createTestContext();
    render(
      <ContextWrapper>
        <TestComponent />
      </ContextWrapper>
    );
    toggleCheckedImage({ name: "name1", url: "url1" } as ImageItem);
    toggleCheckedImage({ name: "name2", url: "url2" } as ImageItem);

    // Act
    selectCheckedImage();

    // Assert
    expect(selectCheckedIsNull()).toBe(true);
  });
});