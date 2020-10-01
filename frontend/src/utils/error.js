export const parseRecordError = (error, defaultMessage = 'Please try again') => {
  if (!Object.keys(error).length) return defaultMessage;

  const errorSubject = Object.keys(error)[0];
  const errorMessages = error[errorSubject];
  if (!Array.isArray(errorMessages) || !errorMessages.length) return defaultMessage;

  const errorMessage = errorMessages[0];
  if (!errorMessage.length) return defaultMessage;

  return errorSubject.charAt(0).toUpperCase() + errorSubject.slice(1) + ` ${errorMessage}`;
}
