import Chats from "@/models/Chats.mjs";
export const GET = async (req, { params }) => {
  const { id } = params;
  try {
    const chats = await Chats.find({
      $or: [{ "chatBetween.user1": id }, { "chatBetween.user2": id }],
    });
    if (!chats) {
      return new Response(JSON.stringify({ message: "Can't Find Chats" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify(chats), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }));
  }
};
