import { Box } from "@chakra-ui/react";
import RcTooltip from "rc-tooltip";

import "rc-tooltip/assets/bootstrap.css";

export default function Tooltip({ text, placement = "top", ...props }) {
  return (
    <RcTooltip
      {...props}
      placement={placement}
      overlay={<Box as="span">{text}</Box>}
    />
  );
}
