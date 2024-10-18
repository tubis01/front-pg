import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { Estado, ResponseCantidad } from '../../interfaces/reporte.types';
import { Proyecto } from '../../interfaces/proyecto.interface';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'dashboard-layout-page',
  templateUrl: './layout-page.component.html',
  styleUrl: './layout-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutPageComponent implements OnInit{

  public startDate: Date | null = null;
  public endDate: Date | null = null;

  public chartData: any;
  public chartOptions: any;
  public completedProjects: Proyecto[] = [];

  public proyectosEnCurso: number = 0;
  public proyectosFinalizados: number = 0;
  public beneficiariosMes: number = 0;
  public beneficiariosActivos: number = 0; // Total de beneficiarios

  constructor(private reporteService: DashboardService,
    private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.configurarGrafico();
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales(): void {

    forkJoin({
      proyectosEnCurso: this.reporteService.contarProyectosPorEstado(Estado.EnProceso),
      proyectosFinalizados: this.reporteService.contarProyectosPorEstado(Estado.Finalizado),
      beneficiariosActivos: this.reporteService.obtenerTotalBeneficiarios(),
      beneficiariosMesActual: this.reporteService.contarBeneficiariosPorMes(new Date().getMonth() + 1)
    }).subscribe({
      next: (resultados) => {
        this.proyectosEnCurso = resultados.proyectosEnCurso;
        this.proyectosFinalizados = resultados.proyectosFinalizados;
        this.beneficiariosActivos = resultados.beneficiariosActivos;
        this.beneficiariosMes = resultados.beneficiariosMesActual;

        this.obtenerBeneficiariosTodosLosMeses();
      },
      error: (err) => {
        console.error('Error al cargar datos iniciales:', err);
      }
    });
  }

  configurarGrafico(): void {
    this.chartData = {
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      datasets: [
        {
          label: 'Beneficiarios',
          backgroundColor: '#42A5F5',
          borderColor: '#1E88E5',
          data: new Array(12).fill(0)
        }
      ]
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 50
          }
        }
      }
    };
  }


  obtenerUltimosProyectosFinalizados(): void {
    this.reporteService.obtenerUltimosProyectosFinalizados(5).subscribe({
      next: (response: Proyecto[]) => {
        // console.log('Últimos proyectos finalizados:', response);
        this.completedProjects = response;
      },
      error: (err: string) => {
        console.error('Error al obtener los últimos proyectos finalizados:', err);
      }
    });
  }


  obtenerProyectosEnCurso(): void {
    this.reporteService.contarProyectosPorEstado(Estado.EnProceso).subscribe({
      next: (response: number) => {
        // console.log('Proyectos en curso:', response);
        this.proyectosEnCurso = response;
      },
      error: (err: string) => {
        console.error('Error al obtener proyectos en curso:', err);
      }
    });
  }

  obtenerProyectosFinalizados(): void {
    this.reporteService.contarProyectosPorEstado(Estado.Finalizado).subscribe({
      next: (response: number) => {
        // console.log('Proyectos finalizados:', response);
        this.proyectosFinalizados = response;
      },
      error: (err: string) => {
        console.error('Error al obtener proyectos finalizados:', err);
      }
    });
  }


  obtenerBeneficiariosPorMes(mes: number): void {
    this.reporteService.contarBeneficiariosPorMes(mes).subscribe({
      next: (response: number) => {
        // console.log('Beneficiarios del mes:', response);
        this.beneficiariosMes = response;
        this.actualizarGraficoBeneficiarios(mes, response);
      },
      error: (err: string) => {
        console.error('Error al obtener beneficiarios por mes:', err);
      }
    });
  }

  obtenerBeneficiariosTodosLosMeses(): void {
    const observables = Array.from({ length: 12 }, (_, i) => this.reporteService.contarBeneficiariosPorMes(i + 1));

    forkJoin(observables).subscribe({
      next: (resultados) => {
        resultados.forEach((cantidad, mes) => {
          this.actualizarGraficoBeneficiarios(mes + 1, cantidad);
        });
      },
      error: (err) => {
        console.error('Error al obtener beneficiarios por mes:', err);
      }
    });
  }

  obtenerTotalBeneficiarios(): void {
    this.reporteService.obtenerTotalBeneficiarios().subscribe({
      next: (response: number) => {
        this.beneficiariosActivos = response;
      },
      error: (err: string) => {
        console.error('Error al obtener el total de beneficiarios:', err);
      }
    });
  }


  actualizarGraficoBeneficiarios(mes: number, cantidad: number): void {
    const updatedData = [...this.chartData.datasets[0].data];
    updatedData[mes - 1] = cantidad; // Actualizar el dato correspondiente al mes
    this.chartData = {
      ...this.chartData,
      datasets: [
        {
          ...this.chartData.datasets[0],
          data: updatedData
        }
      ]
    };
    // this.cd.detectChanges(); // Forzar la detección de cambios después de actualizar el gráfico
    this.cd.markForCheck(); // Marcar el componente para que se actualice en la próxima detección de cambios
  }


  // Método para filtrar proyectos por fecha
  onFilterByDate(): void {
    if (this.startDate && this.endDate) {
      console.log('Filtrar proyectos entre: ', this.startDate, ' y ', this.endDate);
      // Aquí se podría aplicar la lógica para filtrar los proyectos
    }
  }
}
