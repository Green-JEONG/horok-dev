import type { Meta, StoryObj } from "@storybook/react";
import BannerBar from "@/components/layout/BannerBar";

const meta: Meta<typeof BannerBar> = {
  title: "Layout/Banner",
  component: BannerBar,
};

export default meta;

export const Default: StoryObj<typeof BannerBar> = {};
