import { Op } from "sequelize";

const OPERATORS: Record<
  string,
  {
    op: symbol;
    transform: (val: string) => string | string[] | number;
  }
> = {
  eq: { op: Op.eq, transform: (v) => v.toLowerCase() },
  like: { op: Op.like, transform: (v) => `%${v.toLowerCase()}%` },
  in: { op: Op.in, transform: (v) => v.split(",") },
  gt: { op: Op.gt, transform: (v) => Number(v) },
  gte: { op: Op.gte, transform: (v) => Number(v) },
  lt: { op: Op.lt, transform: (v) => Number(v) },
  lte: { op: Op.lte, transform: (v) => Number(v) },
  ne: { op: Op.ne, transform: (v) => v },
};
export function buildSequelizeFilters(
  filters: Record<string, any>,
): Record<string, any> {
  const where: Record<string, any> = {};

  for (const [key, raw] of Object.entries(filters)) {
    const regex = /^(.+?)__(\w+)$/;
    const match = key.match(regex);

    if (match) {
      const field = match[1];
      const operator = match[2];
      const { op, transform } = OPERATORS[operator];
      const transformedValue = transform(raw as string);

      where[field] = { [op]: transformedValue };
    } else {
      where[key] = raw as string;
    }
  }

  return where;
}
export function groupByTables(filters: Record<string, string>) {
  return Object.entries(filters).reduce(
    (acc, [key, value]) => {
      const [table, fieldWithOp] = key.includes(".")
        ? key.split(".", 2)
        : ["root", key];

      if (!acc[table]) {
        acc[table] = {};
      }

      acc[table][fieldWithOp] = value;
      return acc;
    },
    {} as Record<string, Record<string, string>>,
  );
}

export function parseOrderBy(value: string): [string, string, "ASC" | "DESC"] {
  const [rawField, rawDir] = value.split("__");
  const direction = rawDir?.toUpperCase() === "DESC" ? "DESC" : "ASC";

  switch (rawField) {
    case "author":
      return ["author", "name", direction];
    case "editorial":
      return ["editorial", "name", direction];
    case "genre":
      return ["genre", "name", direction];
    default:
      return ["books", rawField, direction];
  }
}
