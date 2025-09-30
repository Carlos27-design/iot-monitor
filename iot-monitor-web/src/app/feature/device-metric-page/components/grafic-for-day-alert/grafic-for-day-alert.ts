import { ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Component, effect, inject, input, signal } from '@angular/core';
import { Device } from '../../../../core/interfaces/device.interface';
import { AlertData } from '../../../../core/services/alert-data';
import { Alert } from '../../../../core/interfaces/alert.interface';
import { catchError, of } from 'rxjs';
import { MaterialModule } from '../../../../shared/material/material-module';
import { MatSnackBar } from '@angular/material/snack-bar';

// Importar Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registrar los componentes necesarios
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface MetricCount {
  [date: string]: {
    temperature: number;
    humidity: number;
    battery: number;
    other: number;
  };
}

@Component({
  selector: 'app-grafic-for-day-alert',
  imports: [BaseChartDirective, MaterialModule],
  templateUrl: './grafic-for-day-alert.html',
  styleUrl: './grafic-for-day-alert.css',
})
export class GraficForDayAlert {
  private readonly snackBar = inject(MatSnackBar);
  private readonly alertData = inject(AlertData);

  public device = input<Device | null>();

  // Configuración de colores para cada métrica
  private readonly metricColors = {
    temperature: {
      backgroundColor: 'rgba(255, 99, 132, 0.6)',
      borderColor: 'rgba(255, 99, 132, 1)',
      label: 'Temperatura',
    },
    humidity: {
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgba(54, 162, 235, 1)',
      label: 'Humedad',
    },
    battery: {
      backgroundColor: 'rgba(255, 206, 86, 0.6)',
      borderColor: 'rgba(255, 206, 86, 1)',
      label: 'Batería',
    },
    other: {
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      label: 'Otras',
    },
  };

  public chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Alertas por día y métrica',
        font: {
          size: 16,
        },
      },
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          footer: (tooltipItems) => {
            const total = tooltipItems.reduce((sum, item) => sum + (item.parsed.y || 0), 0);
            return `Total: ${total} alertas`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: 'Fecha',
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
        title: {
          display: true,
          text: 'Número de Alertas',
        },
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
  };

  public barChartLabels = signal<string[]>([]);
  public barChartLegend = signal<boolean>(true);
  public barChartData = signal<any[]>([]);
  public alerts = signal<Alert[]>([]);

  // Señales para estadísticas
  public totalAlerts = signal<number>(0);
  public metricStats = signal<{ [key: string]: number }>({});

  constructor() {
    effect(() => {
      const currentDevice = this.device();

      // Si no hay dispositivo, limpiar los datos
      if (!currentDevice?.id) {
        this.alerts.set([]);
        this.barChartLabels.set([]);
        this.barChartData.set([]);
        this.totalAlerts.set(0);
        this.metricStats.set({});
        return;
      }

      // Obtener las alertas cuando hay un dispositivo válido
      this.alertData
        .getAlertByDeviceId(currentDevice.id)
        .pipe(
          catchError((error) => {
            this.snackBar.open('❌ Error al obtener alertas', 'Cerrar', {
              duration: 5000,
              panelClass: ['error-snackbar'],
            });
            console.error('Error al obtener alertas:', error);
            return of([]);
          })
        )
        .subscribe((alertsData) => {
          this.alerts.set(alertsData);
          this.processAlertsData(alertsData);
        });
    });
  }

  private processAlertsData(alertsData: Alert[]): void {
    if (!alertsData || alertsData.length === 0) {
      this.barChartLabels.set([]);
      this.barChartData.set([]);
      this.totalAlerts.set(0);
      this.metricStats.set({});
      return;
    }

    // Procesar las alertas agrupadas por día y métrica
    const metricCountByDay: MetricCount = {};
    const statsCount = {
      temperature: 0,
      humidity: 0,
      battery: 0,
      other: 0,
    };

    alertsData.forEach((alert) => {
      try {
        // Extraer la fecha
        const date =
          alert.createdAt instanceof Date
            ? alert.createdAt.toISOString().split('T')[0]
            : new Date(alert.createdAt).toISOString().split('T')[0];

        // Inicializar el día si no existe
        if (!metricCountByDay[date]) {
          metricCountByDay[date] = {
            temperature: 0,
            humidity: 0,
            battery: 0,
            other: 0,
          };
        }

        // Clasificar la alerta por tipo de métrica
        const metricType = this.classifyAlertType(alert);
        metricCountByDay[date][metricType]++;
        statsCount[metricType]++;
      } catch (error) {
        console.error('Error procesando alerta:', alert, error);
      }
    });

    // Ordenar las fechas
    const sortedDates = Object.keys(metricCountByDay).sort();

    // Preparar los datasets para cada métrica
    const datasets = Object.keys(this.metricColors)
      .map((metricKey) => {
        const metricConfig = this.metricColors[metricKey as keyof typeof this.metricColors];
        return {
          label: metricConfig.label,
          data: sortedDates.map(
            (date) => metricCountByDay[date][metricKey as keyof MetricCount[string]]
          ),
          backgroundColor: metricConfig.backgroundColor,
          borderColor: metricConfig.borderColor,
          borderWidth: 1,
        };
      })
      .filter((dataset) => dataset.data.some((value) => value > 0)); // Solo mostrar métricas con datos

    // Actualizar las señales
    this.barChartLabels.set(sortedDates);
    this.barChartData.set(datasets);
    this.totalAlerts.set(alertsData.length);
    this.metricStats.set(statsCount);
  }

  /**
   * Clasifica el tipo de alerta basándose en su contenido
   * Puedes modificar esta lógica según tu estructura de datos
   */
  private classifyAlertType(alert: Alert): keyof MetricCount[string] {
    // Asumiendo que el alert tiene propiedades como 'type', 'message', 'metric', etc.
    // Modifica esta lógica según tu interfaz Alert

    const alertText = (
      alert.message ||
      alert.alertType ||
      alert.metric.metric ||
      JSON.stringify(alert)
    ).toLowerCase();

    if (
      alertText.includes('temperatura') ||
      alertText.includes('temperature') ||
      alertText.includes('temp')
    ) {
      return 'temperature';
    }

    if (
      alertText.includes('humedad') ||
      alertText.includes('humidity') ||
      alertText.includes('humid')
    ) {
      return 'humidity';
    }

    if (
      alertText.includes('bateria') ||
      alertText.includes('battery') ||
      alertText.includes('bat')
    ) {
      return 'battery';
    }

    return 'other';
  }

  /**
   * Método público para obtener estadísticas de métricas
   */
  public getMetricPercentage(metric: string): number {
    const total = this.totalAlerts();
    const count = this.metricStats()[metric] || 0;
    return total > 0 ? Math.round((count / total) * 100) : 0;
  }
}
