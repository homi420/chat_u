import User from "@/models/User";
import { connectToDb } from "@/utils/connectToDb.mjs";

export const GET = async (req, { params }) => {
  const { id } = params;
  await connectToDb();
  try {
    const Users = await User.find({ _id: { $ne: id } })
      .populate("addedUsers")
      .populate("addedBy")
      .populate("blockedUsers")
      .populate("blockedBy")
      .select("-password");
    return new Response(JSON.stringify(Users), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: "Internal Server Error!" }), {
      status: 500,
    });
  }
};
