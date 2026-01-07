import type { Meta, StoryObj } from "@storybook/react";
import PopularPosts from "@/components/sidebar/PopularPosts";
import RecommendedKeywords from "@/components/sidebar/RecommendedKeywords";

function SidebarMock() {
  return (
    <aside className="w-64 border p-4 space-y-6 bg-background">
      <PopularPosts />
      <RecommendedKeywords />
    </aside>
  );
}

const meta: Meta<typeof SidebarMock> = {
  title: "Sidebar/Default",
  component: SidebarMock,
};

export default meta;

export const Default: StoryObj<typeof SidebarMock> = {};
