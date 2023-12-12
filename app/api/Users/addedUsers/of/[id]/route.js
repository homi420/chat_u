import User from "@/models/User";

export const GET = async (req, { params }) => {
  const { id } = params;
  try {
    const user = await User.findById(id)
      .populate("addedUsers")
      .select("-password")
      .populate("blockedUsers")
      .select("-password")
      .populate("blockedBy")
      .select("-password");
    if (!user) {
      return new Response(JSON.stringify({ message: "No User Found" }), {
        status: 404,
      });
    }
    const userWithoutPopulating = await User.findById(id).select("-password");
    return new Response(
      JSON.stringify({
        addedUsers: user.addedUsers,
        blockedUsers: user.blockedUsers,
        userWithoutPopulating,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: "Internal Server Error!" }), {
      status: 500,
    });
  }
};
