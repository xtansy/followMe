import "./styles.scss";

import { FC } from "react";
import cn from "classnames";

export const FeatherSvg: FC<{ className?: string }> = ({ className }) => (
  <svg
    className={cn("feed-decoration", className)}
    viewBox="0 0 24 24"
    fill="#e22626"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillOpacity="0.08"
      d="M12 2C8.13 2 5 5.13 5 9c0 4.75 4 8 8 8s8-3.25 8-8c0-3.87-3.13-7-7-7zm-1 14h-2v2h2v-2zm4 0h-2v2h2v-2z"
    />
  </svg>
);
