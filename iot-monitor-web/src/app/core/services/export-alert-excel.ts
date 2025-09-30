import { inject, Injectable } from '@angular/core';
import { Device } from '../interfaces/device.interface';
import { AlertData } from './alert-data';
import { Workbook } from 'exceljs';
import { firstValueFrom } from 'rxjs';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class ExportAlertExcel {
  private alertData = inject(AlertData);
  public async exportAlertsExcel(device: Device, start: string, end: string) {
    try {
      const alerts = await firstValueFrom(
        this.alertData.getAlertsByDeviceAndPeriod(device.id, start, end)
      );

      if (!alerts || alerts.length === 0) return;

      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet(`Alertas de dispositivo ${device.name}`);

      worksheet.columns = [
        { header: 'Métricas', key: 'metric', width: 20 },
        { header: 'Mensaje', key: 'message', width: 40 },
        { header: 'Fecha y Hora', key: 'createdAt', width: 20 },
        { header: 'Resuelto', key: 'resolved', width: 10 },
        { header: 'Severidad', key: 'severity', width: 30 },
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

      alerts.forEach((alert) => {
        worksheet.addRow({
          metric: alert.metric.metric,
          message: alert.message,
          severity: alert.severety,
          createdAt: this.formattedDate(alert.createdAt),
          resolved: alert.resolved ? 'Si' : 'No',
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

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      saveAs(blob, `Alertas_dispositivo_${device.name}.xlsx`);
    } catch (error) {
      console.log(error);
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
