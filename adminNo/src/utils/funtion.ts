export const convertDate = () => {
  const date = new Date('2025-04-01T15:03:15.000Z');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getUTCFullYear();
  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
};
