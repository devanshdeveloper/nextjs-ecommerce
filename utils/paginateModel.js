import connectDB from "@/lib/mongoose";

async function paginateModel(Model, request) {
  try {
    const { searchParams } = new URL(request.url);
    let pageParam = searchParams.get("pageParam");
    if (!pageParam) {
      pageParam = 1;
    }
    let limit = searchParams.get("limit");
    console.log(limit);
    if (!limit) {
      limit = 10;
    }
    connectDB();
    const count = await Model.countDocuments({});
    const totalPages = Math.ceil(count / limit);
    if (pageParam > totalPages) {
      return [{ info: { nextPage: null } }, { status: 500 }];
    }
    let nextPage = +pageParam + 1;
    if (+pageParam === totalPages) {
      nextPage = null;
    }
    const data = await Model.find({})
      .skip((pageParam - 1) * 10)
      .limit(limit);
    return [{ info: { pageParam, limit, count, totalPages, nextPage }, data }];
  } catch (err) {
    console.log(err);
    return [{ err }, { status: 500 }];
  }
}

export default paginateModel;
