import type { Meta, StoryObj } from "@storybook/react";
import MyPageDrawer from "@/components/mypage/MyPageDrawer";

function DrawerOpen() {
  return <MyPageDrawer open onClose={() => {}} />;
}

const meta: Meta<typeof DrawerOpen> = {
  title: "MyPage/Drawer",
  component: DrawerOpen,
};

export default meta;

export const Open: StoryObj<typeof DrawerOpen> = {};
