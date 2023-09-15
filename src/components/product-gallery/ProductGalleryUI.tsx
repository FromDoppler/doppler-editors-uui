import { ProductGalleryValue } from "../../abstractions/domain/product-gallery";
import { Footer } from "../base-gallery/Footer";
import { FooterSubmitButton } from "../base-gallery/FooterSubmitButton";
import { Form } from "../base-gallery/Form";
import { FormattedMessage } from "react-intl";
import { Header } from "../base-gallery/Header";
import { HeaderSearchInput } from "../base-gallery/HeaderSearchInput";
import {
  HeaderSortProductsDropdown,
  SortingProductsPair,
} from "./HeaderSortProductsDropdown";
import { Content } from "../base-gallery/Content";
import { ProductGalleryContentEmpty } from "./ProductGalleryContentEmpty";
import { ProductGalleryContentNoResult } from "./ProductGalleryContentNoResult";
import { ContentList } from "../base-gallery/ContentList";
import { GalleryItem } from "../base-gallery/GalleryItem";

export const ProductGalleryUI = ({
  cancel,
  checkedItemIds,
  debouncedSearchTerm,
  fetchNextPage,
  hasNextPage,
  isFetching,
  items,
  searchTerm,
  selectCheckedItem,
  selectItem,
  setSearchTerm,
  setSorting,
  sorting,
  toggleCheckedItem,
}: {
  cancel: () => void;
  checkedItemIds: ReadonlySet<string>;
  debouncedSearchTerm: string;
  fetchNextPage: () => void;
  hasNextPage: boolean | undefined;
  isFetching: boolean;
  items: GalleryItem<ProductGalleryValue>[];
  searchTerm: string;
  selectCheckedItem: (() => void) | null;
  selectItem: (item: ProductGalleryValue) => void;
  setSearchTerm: (value: string) => void;
  setSorting: (value: SortingProductsPair) => void;
  sorting: SortingProductsPair;
  toggleCheckedItem: (id: string) => void;
}) => (
  <Form onCancel={cancel} onSubmit={selectCheckedItem}>
    <Header>
      <HeaderSortProductsDropdown value={sorting} setValue={setSorting} />
      <HeaderSearchInput value={searchTerm} setValue={setSearchTerm} />
    </Header>
    <Content
      isFetching={isFetching}
      searchTerm={debouncedSearchTerm}
      emptyResults={items.length === 0}
      ContentEmptyComponent={ProductGalleryContentEmpty}
      ContentNoResultComponent={ProductGalleryContentNoResult}
    >
      {/* TODO: use a list view in place of this icons view */}
      <ContentList
        items={items}
        checkedItemIds={checkedItemIds}
        toggleCheckedItem={toggleCheckedItem}
        selectItem={selectItem}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
      />
    </Content>
    <Footer>
      <FooterSubmitButton isEnabled={!!selectCheckedItem}>
        <FormattedMessage id="select_product" />
      </FooterSubmitButton>
    </Footer>
  </Form>
);