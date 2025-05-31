export const toLocaleDateString = (date: Date) => {
  return new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'full',
    timeStyle: 'medium',
  }).format(date);
};
