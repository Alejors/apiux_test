export function capitalizeWords(str: string): string {
  return str
    .toLocaleLowerCase()
    .replace(
      /\p{L}+/gu,
      (word) => word.charAt(0).toLocaleUpperCase() + word.slice(1),
    );
}
