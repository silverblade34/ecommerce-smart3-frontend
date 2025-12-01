export const transformStringToArray = (
  input: string
): { name: string; value: string }[] => {
  const pairs = input.split('¬').filter((pair) => pair.includes(':'));

  return pairs.map((pair) => {
    const [name, value] = pair.split(':').map((str) => str.trim());
    return { name, value };
  });
};
