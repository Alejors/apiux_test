import { capitalizeWords } from "./capitalization.util";

describe("capitalizeWords", () => {
  it("debería capitalizar palabras simples", () => {
    const input = "pedro";
    const result = capitalizeWords(input);
    expect(result).toBe("Pedro");
  });

  it("debería capitalizar frases", () => {
    const input = "hola mundo";
    const result = capitalizeWords(input);
    expect(result).toBe("Hola Mundo");
  });

  it("debería manejar mayúsculas y minúsculas mezcladas", () => {
    const input = "pEdRiTo dEl fLow";
    const result = capitalizeWords(input);
    expect(result).toBe("Pedrito Del Flow");
  });

  it("debería manejar palabras con caracteres Unicode", () => {
    const input = "mañana será otro día";
    const result = capitalizeWords(input);
    expect(result).toBe("Mañana Será Otro Día");
  });

  it("debería devolver una cadena vacía si el input lo es", () => {
    const input = "";
    const result = capitalizeWords(input);
    expect(result).toBe("");
  });

  it("debería manejar múltiples espacios entre palabras", () => {
    const input = "  mucho    espacio ";
    const result = capitalizeWords(input);
    expect(result).toBe("  Mucho    Espacio ");
  });
});
