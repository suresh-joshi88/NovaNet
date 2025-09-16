// frontend/src/utils/format.js
export const displayTime = (iso) => {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleString();
};

export const normalizeId = (item) => item.id || item._id || null;
