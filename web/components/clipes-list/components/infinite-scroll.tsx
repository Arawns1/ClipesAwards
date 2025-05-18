"use client";
import { Clipe, ClipeDTO } from "@/@types/Clipe";
import { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import { forwardRef, HTMLAttributes, ReactNode } from "react";
import { GridItemContent, VirtuosoGrid } from "react-virtuoso";

type ListProps = HTMLAttributes<HTMLDivElement>;
interface ItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

const List = forwardRef<HTMLDivElement, ListProps>(
  ({ style, children, ...props }, ref) => (
    <div
      ref={ref}
      {...props}
      className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3"
      style={{ ...style }}
    >
      {children}
    </div>
  ),
);
List.displayName = "List";

const Item: React.FC<ItemProps> = ({ children, ...props }) => (
  <div {...props}>{children}</div>
);

const gridComponents = {
  List,
  Item,
};

interface Props {
  queryResponse: UseInfiniteQueryResult<InfiniteData<ClipeDTO, unknown>, Error>;
  pendingComponent: React.ReactNode;
  hasNoMorePagesComponent: React.ReactNode;
  loadingMoreComponent: React.ReactNode;
  itemContent: GridItemContent<Clipe, unknown>;
}
export default function InfiniteScroll({
  queryResponse,
  pendingComponent,
  hasNoMorePagesComponent,
  loadingMoreComponent,
  itemContent,
}: Props) {
  const {
    data,
    hasNextPage,
    error,
    isError,
    isPending,
    isFetchingNextPage,
    fetchNextPage,
  } = queryResponse;

  const allRows = data ? data.pages.flatMap((d) => d.data) : [];

  if (isPending || !data || data.pages.length === 0) {
    return pendingComponent;
  }

  if (isError) {
    return (
      <p className="wrapper">{"message" in error ? error.message : error}</p>
    );
  }

  const fetchNext = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const Footer: React.FC = () => {
    const hasFetchedAll = !hasNextPage && !isFetchingNextPage;
    if (hasFetchedAll) return hasNoMorePagesComponent;
    return <div className="py-8">{loadingMoreComponent}</div>;
  };

  return (
    <>
      <VirtuosoGrid
        useWindowScroll
        data={allRows}
        endReached={fetchNext}
        increaseViewportBy={{ top: 300, bottom: 300 }}
        overscan={{ main: 200, reverse: 200 }}
        components={{
          List: gridComponents.List,
          Item: gridComponents.Item,
          Footer: Footer,
        }}
        itemContent={itemContent}
      />
      <style>{`html, body, #root { margin: 0; padding: 0 }`}</style>
    </>
  );
}
