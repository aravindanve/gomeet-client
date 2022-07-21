import { Spinner } from "@chakra-ui/react";
import LayoutFlex from "./LayoutFlex";

export default function LayoutLoading() {
  return (
    <LayoutFlex alignItems="center" justifyContent="center">
      <Spinner size="xl" emptyColor="purple.200" color="purple.500" />
    </LayoutFlex>
  );
}
