import User from "@/models/User";

export const PATCH = async (req, { params }) => {
  const idToBeAdded = params.this;
  const addToId = params.that;
  try {
    const user = await User.findByIdAndUpdate(
      addToId,
      { $addToSet: { addedUsers: idToBeAdded } },
      { new: true }
    );
    const userToBeAdded = await User.findByIdAndUpdate(
      idToBeAdded,
      { $addToSet: { addedBy: addToId } },
      { new: true }
    );

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found!" }), {
        status: 404,
      });
    }

    if (!userToBeAdded) {
      return new Response(
        JSON.stringify({ message: "User you want to add not found!" }),
        {
          status: 404,
        }
      );
    }
    return new Response(JSON.stringify({ message: "Contact Added" }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: "Internal Server Error!" }), {
      status: 500,
    });
  }
};
