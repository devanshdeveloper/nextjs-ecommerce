import connectDB from "@/lib/mongoose";
import User from "@/models/User";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  let id = searchParams.get("id");
  let search = searchParams.get("search");
  let pageParam = searchParams.get("pageParam") || 1;
  let limit = searchParams.get("limit") || 10;

  try {
    await connectDB();

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { role: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const count = await User.countDocuments(query);
    const totalPages = Math.ceil(count / limit);
    if (pageParam > totalPages) {
      return Response.json({ error: "Page not found" }, { status: 404 });
    }
    const nextPage = +pageParam === totalPages ? null : +pageParam + 1;

    const users = await User.find(query)
      .skip((pageParam - 1) * limit)
      .limit(+limit);

    if (users.length === 0) {
      return Response.json({ error: "No users found" }, { status: 404 });
    }

    return Response.json({
      info: { pageParam, limit, count, totalPages, nextPage },
      data: users,
    });

  } catch (err) {
    console.log(err);
    return Response.json(err, { status: 500 });
  }
}
