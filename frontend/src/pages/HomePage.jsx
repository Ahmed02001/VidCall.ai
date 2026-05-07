import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/react";

import toast from "react-hot-toast";

export default function HomePage() {
  return (
    <>
      <button
        className="btn btn-secondary"
        onClick={() => {
          toast.loading("Hello In My Project");
        }}
      >
        Show Toast
      </button>
      <Show when="signed-out">
        <SignInButton />
        <SignUpButton />
      </Show>
      <Show when="signed-in">
        <UserButton />
      </Show>
    </>
  );
}
