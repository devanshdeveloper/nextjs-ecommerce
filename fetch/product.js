import fetchApi from "@/utils/fetchApi";
import { getImagesFromBucket } from "@/utils/s3-bucket-front";

async function getImagesForProducts(products) {
  const keys = products.flatMap((product) => product.images);
  const urls = await getImagesFromBucket(...keys);
  return products.map((product) => ({
    ...product,
    images: product.images.map((image) => urls[image]),
  }));
}

export async function createOneProduct(body) {
  return await fetchApi("/api/product/create-one", {
    body,
  });
}

export async function readOneProduct({ id }) {
  const product = await fetchApi(`/api/product/read-one?id=${id}`, {
    method: "GET",
  });
  return (await getImagesForProducts([product]))[0];
}

export async function updateOneProduct(product) {
  return await fetchApi(`/api/product/update-one`, {
    method: "PUT",
    body: { id: product?._id, newProduct: product },
  });
}

export async function deleteOneProduct({ id }) {
  return await fetchApi(`/api/product/delete-one?id=${id}`, {
    method: "DELETE",
    body: { id },
  });
}

export async function readAllProducts({ pageParam, limit, search }) {
  const result = await fetchApi(
    `/api/product/read-all?pageParam=${pageParam}&limit=${limit}&search=${search}`,
    {
      method: "GET",
    }
  );
  return {
    ...result,
    data: await getImagesForProducts(result.data),
  };
}

export async function readProductsByIds({ pageParam, limit, productIds }) {
  const result = await fetchApi(
    `/api/product/read-by-ids?pageParam=${pageParam}&limit=${limit}`,
    {
      body: { productIds },
      method: "POST",
    }
  );
  return {
    ...result,
    data: await getImagesForProducts(result.data),
  };
}

export async function readProductsByCategoryId({
  pageParam,
  limit,
  categoryId,
  search,
}) {
  const result = await fetchApi(
    `/api/product/read-by-category-id?pageParam=${pageParam}&limit=${limit}&categoryId=${categoryId}&search=${search}`,
    {
      method: "POST",
    }
  );
  return {
    ...result,
    data: await getImagesForProducts(result.data),
  };
}

export async function feedProducts() {
  const result = await fetchApi(`/api/product/feed-products`, {
    method: "GET",
  });
  const returnedProducts = {
    categories: await Promise.all(
      result.categories.map((category) => {
        return new Promise(async (resolve, reject) => {
          const products = await getImagesForProducts(category.products);
          resolve({
            category: category.category,
            products: products,
          });
        });
      })
    ),
  };
  return returnedProducts;
}
