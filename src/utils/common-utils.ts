import { format } from "date-fns";

export const generateMonthOptions = () => {
  const months = [];
  for (let month = 0; month < 12; month++) {
    const date = new Date(new Date().getFullYear(), month, 1);
    const value = format(date, 'MM');
    const label = format(date, 'MMMM');
    months.push({ value, label });
  }
  return months;
};