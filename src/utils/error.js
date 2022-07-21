export const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message ??
    error?.message ??
    error ??
    "Oops, something isn't right!"
  );
};
