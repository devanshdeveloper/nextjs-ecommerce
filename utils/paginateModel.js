import connectDB from "@/lib/mongoose";

async function paginateModel(Model, request) {
  try {
    const { searchParams } = new URL(request.url);
    let search = searchParams.get("search");
    let pageParam = +searchParams.get("pageParam") || 1;
    let limit = +searchParams.get("limit") || 10;

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { role: { $regex: search, $options: "i" } },
          ],
        }
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
      .skip((pageParam - 1) * limit)
      .limit(limit);
    return [{ info: { pageParam, limit, count, totalPages, nextPage }, data }];
  } catch (err) {
    console.log(err);
    return [{ err }, { status: 500 }];
  }
}

export default paginateModel;
