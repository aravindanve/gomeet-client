import { Box } from "@chakra-ui/react";
import RcTooltip from "rc-tooltip";

import "rc-tooltip/assets/bootstrap.css";

export default function Tooltip({ text, placement = "top", visible, ...props }) {
  return (
    <RcTooltip
      {...props}
      {...(typeof visible === 'boolean' && { visible })}
      placement={placement}
      overlay={<Box as="span">{text}</Box>}
    />
  );
}
