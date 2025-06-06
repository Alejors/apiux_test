import { Injectable } from '@nestjs/common';
import { createObjectCsvStringifier } from 'csv-writer';

type CsvHeader = { id: string; title: string };
@Injectable()
export class CsvExportService {
  exportToCsv<T>(records: T[], headers: CsvHeader[]): string {
    const csvStringifier = createObjectCsvStringifier({ header: headers });
    const mappedRecords = records.map(record => {
      const obj: Record<string, any> = {};
      headers.forEach(header => {
        obj[header.id] = (record as any)[header.id];
      });
      return obj;
    });
    return csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(mappedRecords);
  }
}
