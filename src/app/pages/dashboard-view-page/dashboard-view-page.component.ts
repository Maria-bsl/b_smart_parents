import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/pages/dashboard-service/dashboard.service';

@Component({
  selector: 'app-dashboard-view-page',
  templateUrl: './dashboard-view-page.component.html',
  styleUrls: ['./dashboard-view-page.component.scss'],
  standalone: true,
})
export class DashboardViewPageComponent implements OnInit {
  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.initDashboard();
  }
}
