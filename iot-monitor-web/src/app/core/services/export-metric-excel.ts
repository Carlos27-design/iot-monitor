import { inject, Injectable } from '@angular/core';
import { DeviceMetricData } from './device-metric-data';
import { firstValueFrom } from 'rxjs';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import { Device } from '../interfaces/device.interface';

@Injectable({
  providedIn: 'root',
})
export class ExportMetricExcel {
  private deviceMetricData = inject(DeviceMetricData);
  public async exportMetricsByDeviceId(device: Device, start: string, end: string) {
    try {
      const metrics = await firstValueFrom(
        this.deviceMetricData.getMetricsByDeviceAndPeriod(device.id, start, end)
      );

      if (!metrics || metrics.length === 0) return;

      const workBook = new Workbook();
      const worksheet = workBook.addWorksheet(`Metricas de dispositivo ${device.name}`);

      worksheet.columns = [
        { header: 'Métricas', key: 'metric', width: 10 },
        { header: 'Porcentaje', key: 'valueNum', width: 10 },
        { header: 'Fecha y Hora', key: 'recordedAt', width: 20 },
      ];

      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true, color: { argb: 'FFFFFF' } };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '2563EB' },
        };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });

      metrics.forEach((metric) => {
        worksheet.addRow({
          metric: metric.metric,
          valueNum: metric.valueNum,
          recordedAt: this.formattedDate(metric.recordedAt),
        });
      });

      worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell) => {
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
        });

        if (rowNumber % 2 === 0 && rowNumber !== 1) {
          row.eachCell((cell) => {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'F3F4F6' },
            };
          });
        }
      });

      const buffer = await workBook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      saveAs(blob, `Metricas_dispositivo_${device.name}.xlsx`);
    } catch (error) {
      console.error('Error al exportar las meticas:');
    }
  }

  private formattedDate(date: string | Date): string {
    const dateObj = new Date(date);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }
}
