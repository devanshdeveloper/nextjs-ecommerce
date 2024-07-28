import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function AsyncAutoCompete({
  queryKey,
  queryFn,
  value,
  setValue,
  ...props
}) {
  const [inputValue, setInputValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const { data, error, isFetching } = useInfiniteQuery({
    queryKey: [queryKey, searchValue],
    queryFn: (params) => queryFn({ ...params, search: searchValue }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.info.nextPage;
    },
    refetchOnWindowFocus: false,
    retry: false,
  });

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const debouncedMutateSearchCategory = useDebouncedCallback((search) => {
    if (search.length < 3) return setSearchValue("");
    setSearchValue(search);
  }, 2000);
  const defaultItems = data?.pages.flatMap((page) => page.data);

  return (
    <Autocomplete
      {...props}
      className="max-w-xs"
      isLoading={isFetching}
      defaultItems={defaultItems || []}
      label="Select a Category"
      onInputChange={(value) => {
        debouncedMutateSearchCategory(value);
        const id = defaultItems?.find(
          (category) => category.name === value
        )?._id;
        if (id) {
          setValue({ id, name: value });
        }
      }}
      inputValue={inputValue}
    >
      {(item) => {
        return (
          <AutocompleteItem
            key={item._id}
            value={item._id}
            className="capitalize"
          >
            {item.name}
          </AutocompleteItem>
        );
      }}
    </Autocomplete>
  );
}
