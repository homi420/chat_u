import User from "@/models/User";

export const PATCH = async (req, { params }) => {
  const idToBeRemove = params.this;
  const removeFrom = params.that;
  try {
    const user = await User.findByIdAndUpdate(removeFrom, {
      $pull: { addedUsers: idToBeRemove },
    });
    const userToBeRemoved = await User.findByIdAndUpdate(idToBeRemove, {
      $pull: { addedBy: removeFrom },
    });

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found!" }), {
        status: 404,
      });
    }

    if (!userToBeRemoved) {
      return new Response(
        JSON.stringify({ message: "User you want to remove not found!" }),
        {
          status: 404,
        }
      );
    }
    return new Response(JSON.stringify({ message: "Contact Removed" }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: "Internal Server Error!" }), {
      status: 500,
    });
  }
};
