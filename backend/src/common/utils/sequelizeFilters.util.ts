import { Op } from "sequelize";

export function buildSequelizeFilters(
  filters: Record<string, any>,
): Record<string, any> {
  const where: Record<string, any> = {};

  for (const [key, raw] of Object.entries(filters)) {
    if (key.endsWith("__in")) {
      const field = key.replace("__in", "");
      const values = String(raw)
        .split(",")
        .map((v) => v.trim());
      where[field] = {
        [Op.in]:
          field.endsWith("id") || field === "id" ? values.map(Number) : values,
      };
    } else if (key.endsWith("__like")) {
      const field = key.replace("__like", "");
      where[field] = { [Op.like]: `%${raw}%` };
    } else if (key === "id" || key.endsWith("id")) {
      where[key] = Number(raw);
    } else {
      where[key] = raw;
    }
  }

  return where;
}
