export const makeInfoToast = (message, id) => {
  return {
    id,
    position: "top",
    description: message,
    status: "info",
    duration: 2000,
    isClosable: true,
  };
};

export const makeErrorToast = (message, id) => {
  return {
    id,
    position: "top",
    title: "Error",
    description: message,
    status: "error",
    duration: 5000,
    isClosable: true,
  };
};
