export const handleApiError = (error: unknown, context: string) => {
  console.error(`${context} error:`, error);
  return {
    success: false,
    message: 'An unexpected error occurred. Please try again.',
    errors: { submit: 'Internal server error' }
  };
};