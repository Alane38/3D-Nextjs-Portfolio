export const useProdEnv = () => {
  const production = process.env.NODE_ENV === "production";
  return production;
};
