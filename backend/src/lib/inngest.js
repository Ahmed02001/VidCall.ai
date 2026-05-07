import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import User from "../models/Users.js";
import { deleteStreamUser, upsertStreamUser } from "./stream.js";
import { Resend } from "resend";
import { ENV } from "./env.js";

export const inngest = new Inngest({ id: "vid-call.ai" });

const resend = new Resend(ENV.RESEND_API_KEY);

const syncUser = inngest.createFunction(
  {
    id: "sync-user",
  },
  { event: "clerk/user.created" },
  async ({ event, step }) => {
    await connectDB();

    const { id, email_addresses, first_name, last_name, image_url } =
      event.data;

    const newUser = {
      clerkId: id,
      email: email_addresses[0].email_address,
      name: `${first_name || ""} ${last_name || ""}`,
      profileImage: image_url,
    };

    await User.create(newUser);

    await upsertStreamUser({
      id: newUser.clerkId.toString(),
      name: newUser.name,
      image: newUser.profileImage,
    });

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email_addresses.toString(),
      subject: "Welcome To Our App",
      html: "<p>Thanks For Signing UP!</p>",
    });
    // await step.run("send-welcome-email", async () => {
    //   return await sendEmail({
    //     to: email_addresses,
    //     subject: "Welcome To Our App",
    //     body: "<p>Thanks For Signing UP!</p>",
    //   });
    // });

    //send message for each user when he create account
  },
);

const deleteUserFromDB = inngest.createFunction(
  {
    id: "delete-user-from-db",
  },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await connectDB();

    const { id } = event.data;

    await User.deleteOne({ clerkId: id });
    await deleteStreamUser(id.toString());
  },
);

export const functions = [syncUser, deleteUserFromDB];
