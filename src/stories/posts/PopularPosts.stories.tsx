import type { Meta, StoryObj } from "@storybook/react";
import PopularPosts from "@/components/sidebar/PopularPosts";

const meta: Meta<typeof PopularPosts> = {
  title: "Sidebar/PopularPosts",
  component: PopularPosts,
};

export default meta;

export const Default: StoryObj<typeof PopularPosts> = {};
