import User from "@/models/User";
import { connectToDb } from "@/utils/connectToDb.mjs";
export const POST = async (req) => {
  const { userName, password } = await req.json();
  await connectToDb();

  try {
    const user = await User.findOne({ userName });
    if (!user) {
      return new Response(
        JSON.stringify({
          message: "User Not Found!",
        }),
        { status: 404 }
      );
    } else {
      if (user.password === password) {
        return new Response(
          JSON.stringify({ message: "Logged In Successfully!", user }),
          { status: 200 }
        );
      } else {
        return new Response(
          JSON.stringify({ message: "Invalid Credentials!" }),
          { status: 400 }
        );
      }
    }
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: "Internal Server Error!" }), {
      status: 500,
    });
  }
};
