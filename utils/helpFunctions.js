export const formatData = async (data) => {
  const obj = {};
  data.forEach((el) => {
    obj[el.symbol] = el;
  });
  return obj;
};
