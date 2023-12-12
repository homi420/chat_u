import User from "@/models/User";

export const PATCH = async (req, { params }) => {
  const toBeUnblock = params.this;
  const unblockFrom = params.that;
  try {
    const user = await User.findByIdAndUpdate(
      toBeUnblock,
      { $pull: { blockedBy: unblockFrom } },
      { new: true }
    );
    const userToUnBlockFrom = await User.findByIdAndUpdate(
      unblockFrom,
      { $pull: { blockedUsers: toBeUnblock } },
      { new: true }
    );

    if (!user) {
      return new Response(
        JSON.stringify({ message: "User you want to unblock not found!" }),
        {
          status: 404,
        }
      );
    }

    if (!userToUnBlockFrom) {
      return new Response(JSON.stringify({ message: "User not found!" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify({ message: "Contact Unblocked" }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: "Internal Server Error!" }), {
      status: 500,
    });
  }
};
