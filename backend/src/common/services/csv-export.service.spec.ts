import { CsvExportService } from "./csv-export.service";

describe("CsvExportService", () => {
  let service: CsvExportService;

  beforeEach(() => {
    service = new CsvExportService();
  });

  it("debería exportar registros a CSV correctamente", () => {
    const records = [
      { id: 1, name: "Juan" },
      { id: 2, name: "María" },
    ];

    const headers = [
      { id: "id", title: "ID" },
      { id: "name", title: "Nombre" },
    ];

    const result = service.exportToCsv(records, headers);

    expect(result).toBe(`ID,Nombre\n1,Juan\n2,María\n`);
  });
});
