import type { Meta, StoryObj } from "@storybook/react";
import LoginModal from "@/components/auth/LoginModal";
import { useState } from "react";

function LoginModalOpen() {
  return <LoginModal open onClose={() => {}} />;
}

const meta: Meta<typeof LoginModalOpen> = {
  title: "Auth/LoginModal",
  component: LoginModalOpen,
};

export default meta;

export const Open: StoryObj<typeof LoginModalOpen> = {};
