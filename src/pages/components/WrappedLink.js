import { Link } from "@chakra-ui/react";
import NextLink from "next/link";

export default function WrappedLink({ href, children, ...props }) {
  return (
    <NextLink href={href} passHref>
      <Link {...props}>{children}</Link>
    </NextLink>
  );
}
