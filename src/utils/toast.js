export const makeErrorToast = (message) => {
  return {
    position: "bottom",
    title: "Error",
    description: message,
    status: "error",
    duration: 5000,
    isClosable: true,
  };
};
