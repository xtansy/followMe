export const calculateExpiresAt = (daysLeft: number): string => {
  const currentDate = new Date();
  const expireDate = new Date(currentDate);
  expireDate.setDate(currentDate.getDate() + daysLeft);
  return expireDate.toISOString();
};
