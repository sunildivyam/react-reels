import { runFetch } from "./Core";

export const getTrialStatus = async () => {
  const jsonData = await runFetch('.bundle');
  if (jsonData) {
    const { x, y, m } = jsonData;
    const hasExpired = (Date.now() - x) > y;
    return hasExpired ? m : '';
  }

  return '';
};
