import { type FC } from "react";
import { ConfigProvider } from "antd";

export const App: FC = () => {
  return (
    <ConfigProvider>
      <div>Vite</div>
    </ConfigProvider>
  );
};
