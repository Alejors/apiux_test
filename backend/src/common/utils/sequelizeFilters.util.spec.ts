import { Op } from "sequelize";

import {
  buildSequelizeFilters,
  groupByTables,
  parseOrderBy,
} from "./sequelizeFilters.util";

describe("Evaluación de Transformación de Filtros para Sequelize", () => {
  it("debería construir filtros con operadores válidos", () => {
    const input = {
      title__like: "Harry",
      year__gt: "2000",
      available: "true",
    };

    const result = buildSequelizeFilters(input);

    expect(result).toEqual({
      title: { [Op.like]: "%harry%" },
      year: { [Op.gt]: 2000 },
      available: "true",
    });
  });

  it("debería generar lista de un string separado por coma y usar Op.in", () => {
    const input = {
      genre__in: "fiction,drama",
    };

    const result = buildSequelizeFilters(input);

    expect(result).toEqual({
      genre: { [Op.in]: ["fiction", "drama"] },
    });
  });

  it("debería ignorar operadores desconocidos y dejar el valor tal cual", () => {
    const input = {
      status: "available__yes",
    };

    const result = buildSequelizeFilters(input);

    expect(result).toEqual({
      status: "available__yes",
    });
  });
});

describe("Agrupamiento de Filtros Según Tabla de Origen", () => {
  it("debería agrupar filtros por tabla", () => {
    const input = {
      "books.title__like": "magic",
      "author.name__eq": "Rowling",
      available: "true",
    };

    const result = groupByTables(input);

    expect(result).toEqual({
      books: { title__like: "magic" },
      author: { name__eq: "Rowling" },
      root: { available: "true" },
    });
  });

  it("debería agrupar correctamente si no hay punto en la key", () => {
    const input = {
      title__like: "magic",
    };

    const result = groupByTables(input);

    expect(result["root"]).toBeDefined();
    expect(result["root"]).toEqual({ title__like: "magic" });
  });

  it("no debería crear root si todos los filtros son agrupables", () => {
    const input = {
      "books.title__like": "magic",
      "author.name__eq": "Rowling",
    };

    const result = groupByTables(input);

    expect(result["root"]).toBeUndefined();
  });
});

describe("Generación de Indicador de Ordenamiento", () => {
  it("debería parsear campo y dirección correctamente con tabla por defecto", () => {
    const result = parseOrderBy("title__desc");
    expect(result).toEqual(["books", "title", "DESC"]);
  });

  it("debería retornar ASC por defecto si la dirección no viene", () => {
    const result = parseOrderBy("title");
    expect(result).toEqual(["books", "title", "ASC"]);
  });

  it("debería retornar ASC por defecto si la dirección no es válida", () => {
    const result = parseOrderBy("title__up");
    expect(result).toEqual(["books", "title", "ASC"]);
  });

  it("debería mapear correctamente campos especiales", () => {
    expect(parseOrderBy("author__asc")).toEqual(["author", "name", "ASC"]);
    expect(parseOrderBy("editorial__desc")).toEqual([
      "editorial",
      "name",
      "DESC",
    ]);
    expect(parseOrderBy("genre")).toEqual(["genre", "name", "ASC"]);
  });
});
