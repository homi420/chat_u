import User from "@/models/User";

export const PATCH = async (req, { params }) => {
  const toBeBlock = params.this;
  const blockFrom = params.that;
  try {
    const user = await User.findByIdAndUpdate(
      toBeBlock,
      { $addToSet: { blockedBy: blockFrom } },
      { new: true }
    );
    const userToBlockFrom = await User.findByIdAndUpdate(
      blockFrom,
      { $addToSet: { blockedUsers: toBeBlock  } },
      { new: true }
    );

    if (!user) {
      return new Response(
        JSON.stringify({ message: "User you want to block not found!" }),
        {
          status: 404,
        }
      );
    }

    if (!userToBlockFrom) {
      return new Response(JSON.stringify({ message: "User not found!" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify({ message: "Contact Blocked" }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: "Internal Server Error!" }), {
      status: 500,
    });
  }
};
