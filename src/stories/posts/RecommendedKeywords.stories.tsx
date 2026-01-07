import type { Meta, StoryObj } from "@storybook/react";
import RecommendedKeywords from "@/components/sidebar/RecommendedKeywords";

const meta: Meta<typeof RecommendedKeywords> = {
  title: "Sidebar/RecommendedKeywords",
  component: RecommendedKeywords,
};

export default meta;

export const Default: StoryObj<typeof RecommendedKeywords> = {};
