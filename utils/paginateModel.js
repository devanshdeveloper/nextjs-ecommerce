import connectDB from "@/lib/mongoose";
import url from "./url";

async function paginateModel({
  Model,
  request,
  queryFunc,
  processData,
  bodyElements = [],
  URLSearchParams = ["search"],
}) {
  try {
    const { searchParams } = url(request.url);
    let [pageParam, limit, ...URLSearchParamsResult] = searchParams.getAll(
      "pageParam",
      "limit",
      ...URLSearchParams
    );
    pageParam = +pageParam || 1;
    limit = +limit || 10;
    console.log("working till here...");

    let bodyArray = [];
    if (bodyElements.length > 0) {
      const body = await request.json();
      bodyArray = bodyElements.map((bodyElem) => body[bodyElem]);
    }

    const query = queryFunc
      ? queryFunc(...URLSearchParamsResult, ...bodyArray)
      : {};
    connectDB();
    const count = await Model.countDocuments(query);
    const totalPages = Math.ceil(count / limit);
    if (pageParam > totalPages) {
      return [{ info: { nextPage: null } }, { status: 500 }];
    }
    let nextPage = pageParam + 1;
    if (pageParam === totalPages) {
      nextPage = null;
    }
    const data = await Model.find(query)
      .sort({ _id: -1 })
      .skip((pageParam - 1) * limit)
      .limit(limit);
    const processedData = processData ? await processData(data) : data;

    return [
      {
        info: { pageParam, limit, count, totalPages, nextPage },
        data: processedData,
      },
    ];
  } catch (err) {
    console.log(err);
    return [{ err }, { status: 500 }];
  }
}

export default paginateModel;
