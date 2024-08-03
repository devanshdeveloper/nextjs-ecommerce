export function updateInfiniteQueryData({ data, pageIndex, dataId, newData }) {
  if (!data) return data;
  const newPagesArray = data.pages.map((page, idx) => {
    if (idx === pageIndex) {
      const newDataArray = page.data.map((item) =>
        item._id === dataId ? newData : item
      );
      return {
        ...page,
        data: newDataArray,
      };
    }
    return page;
  });
  return {
    ...data,
    pages: newPagesArray,
  };
}
export function pushInfiniteQueryData({ data, pageIndex, newData, pushIndex }) {
  if (!data) return data;

  const newPagesArray = data.pages.map((page, idx) => {
    if (idx === pageIndex) {
      const newDataArray = [
        ...page.data.slice(0, pushIndex),
        newData,
        ...page.data.slice(pushIndex),
      ];
      return {
        ...page,
        data: newDataArray,
      };
    }
    return page;
  });
  return {
    ...data,
    pages: newPagesArray,
  };
}
export function deleteInfiniteQueryData({ data, pageIndex, dataId }) {
  if (!data) return data;
  const newPagesArray = data.pages.map((page, idx) => {
    if (idx === pageIndex) {
      const newDataArray = page.data.filter((item) => item._id !== dataId);
      return {
        ...page,
        data: newDataArray,
      };
    }
    return page;
  });
  return {
    ...data,
    pages: newPagesArray,
  };
}
export function readInfiniteQueryData({ data, pageIndex, dataId }) {
  if (!data) return null;
  const page = data.pages[pageIndex];
  return page?.data?.find((item) => item._id === dataId) || null;
}
