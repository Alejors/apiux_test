import { createPaginationLinks } from "./paginationLinks.util";

describe("createPaginationLinks", () => {
  const baseUrl = "https://example.com/items";
  const limit = 10;

  it("debería retornar los links correctos para una página intermedia", () => {
    const result = createPaginationLinks(2, 5, limit, baseUrl);
    expect(result).toEqual({
      first: `${baseUrl}?page=1&limit=10`,
      previous: `${baseUrl}?page=1&limit=10`,
      next: `${baseUrl}?page=3&limit=10`,
      last: `${baseUrl}?page=5&limit=10`,
    });
  });

  it("debería retornar previous=null si estamos en la primera página", () => {
    const result = createPaginationLinks(1, 5, limit, baseUrl);
    expect(result.previous).toBeNull();
  });

  it("debería retornar next=null si estamos en la última página", () => {
    const result = createPaginationLinks(5, 5, limit, baseUrl);
    expect(result.next).toBeNull();
  });

  it("debería manejar el caso de una sola página", () => {
    const result = createPaginationLinks(1, 1, limit, baseUrl);
    expect(result.first).toEqual(result.last);
    expect(result.next).toBeNull();
    expect(result.previous).toBeNull();
  });
});
