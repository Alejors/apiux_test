export const createPaginationLinks = (currentPage: number, totalPages: number, limit: number, baseUrl: string) => {
    const buildLink = (p: number) =>
    `${baseUrl}?page=${p}&limit=${limit}`;
    const links = {
        first: buildLink(1),
        previous: currentPage > 1 ? buildLink(currentPage - 1) : null,
        next: currentPage < totalPages ? buildLink(currentPage + 1) : null,
        last: buildLink(totalPages),
    }

    return links;
};
