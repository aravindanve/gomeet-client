import { Flex } from "@chakra-ui/react";
import FooterFlex from "./FooterFlex";
import HeaderFlex from "./HeaderFlex";

export default function LayoutFlex({
  type = "full",
  header = <HeaderFlex />,
  footer = <FooterFlex />,
  children,
  ...props
}) {
  return (
    <Flex
      width="100vw"
      height="100vh"
      direction="column"
      justifyContent="stretch"
      alignItems="stretch"
    >
      {header ? header : null}
      <Flex
        {...props}
        sx={{
          ...props.sx,
          ...(type === "wide"
            ? {
                margin: "0 auto",
                width: "100%",
                maxWidth: "900px",
                height: "100vh",
              }
            : type === "full"
            ? {
                width: "100vw",
                height: "100vh",
              }
            : {}),
        }}
      >
        {children}
      </Flex>
      {footer ? footer : null}
    </Flex>
  );
}
