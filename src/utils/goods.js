export const goodsToArray = (goods) => {
  if (!goods) return [];
  if (Array.isArray(goods)) return goods.filter(Boolean);
  if (typeof goods === 'object') return Object.values(goods).filter(Boolean);
  return [];
};
