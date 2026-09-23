import type { ArgsProps } from "antd/es/notification/interface";

export const REQUEST_ERROR: ArgsProps = {
  description: "",
  duration: 30,
  message:
    "Не удалось выполнить действие. Пожалуйста, попробуйте ещё раз или свяжитесь с технической поддержкой.",
  placement: "bottomRight",
};
