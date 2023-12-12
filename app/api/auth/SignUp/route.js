import User from "@/models/User";
import { connectToDb } from "@/utils/connectToDb.mjs";

export const POST = async (req) => {
  const { userName, password } = await req.json();
  await connectToDb();
  try {
    const users = await User.find({ userName });
    if (users && users.length > 0) {
      return new Response(
        JSON.stringify({
          message: "Account with this User Name Already Exists!",
        }),
        { status: 400 }
      );
    }
    await User.create({
      userName,
      password,
      addedBy: [],
      addedUsers: [],
      blockedBy: [],
      blockedUsers: [],
    });
    // await newUser.save();
    return new Response(JSON.stringify({ message: "Account Created!" }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: "Internal Server Error!" }), {
      status: 500,
    });
  }
};
