export function updateInfiniteQueryData({ data, pageIndex, dataId, newData }) {
  if (!data) return data;

  const newPagesArray = data.pages.map((page, idx) => {
    if (pageIndex !== undefined && idx !== pageIndex) return page;

    const newDataArray = page.data.map((item) =>
      item._id === dataId ? newData : item
    );
    return {
      ...page,
      data: newDataArray,
    };
  });

  return {
    ...data,
    pages: newPagesArray,
  };
}

export function pushInfiniteQueryData({ data, pageIndex, newData, pushIndex }) {
  if (!data) return data;

  const newPagesArray = data.pages.map((page, idx) => {
    if (pageIndex !== undefined && idx !== pageIndex) return page;

    let newDataArray = [];
    if (pushIndex === "last") {
      newDataArray = [...(page.data || []), newData];
    } else {
      newDataArray = [
        ...(page.data || []).slice(0, pushIndex),
        newData,
        ...(page.data || []).slice(pushIndex),
      ];
    }
    return {
      ...page,
      data: newDataArray,
    };
  });

  return {
    ...data,
    pages: newPagesArray,
  };
}

export function deleteInfiniteQueryData({ data, pageIndex, dataId }) {
  if (!data) return data;
console.log(data, pageIndex, dataId);

  const newPagesArray = data.pages.map((page, idx) => {
    if (pageIndex !== undefined && idx !== pageIndex) return page;

    const newDataArray = page.data.filter((item) => item._id !== dataId);
    return {
      ...page,
      data: newDataArray,
    };
  });

  return {
    ...data,
    pages: newPagesArray,
  };
}

export function readInfiniteQueryData({ data, pageIndex, dataId }) {
  if (!data) return null;

  const pagesToSearch = pageIndex !== undefined ? [data.pages[pageIndex]] : data.pages;

  for (let page of pagesToSearch) {
    const item = page?.data?.find((item) => item._id === dataId);
    if (item) return item;
  }

  return null;
}

// Linear Query Functions
export function updateLinearQueryData({ data, dataId, newData }) {
  if (!data) return data;
  
  return data.map((item) => (item._id === dataId ? newData : item));
}

export function pushLinearQueryData({ data, newData, pushIndex }) {
  if (!data) return [newData];

  if (pushIndex === "last") {
    return [...data, newData];
  } else {
    return [...data.slice(0, pushIndex), newData, ...data.slice(pushIndex)];
  }
}

export function deleteLinearQueryData({ data, dataId }) {
  if (!data) return data;
  return data.filter((item) => item._id !== dataId);
}

export function readLinearQueryData({ data, dataId }) {
  if (!data) return null;
  return data.find((item) => item._id === dataId) || null;
}
