import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./tabs.component').then((t) => t.TabsComponent),
    children: [
      {
        path: 'tab-1',
        loadComponent: () =>
          import('../tab-1/tab-1.component').then((t) => t.Tab1Component),
        children: [
          {
            path: '',
            redirectTo: 'dashboard',
            pathMatch: 'full',
          },
          {
            path: 'dashboard',
            loadComponent: () =>
              import('../dashboard-page/dashboard-page.component').then(
                (c) => c.DashboardPageComponent
              ),
          },
          {
            path: 'change-password',
            loadComponent: () =>
              import(
                '../change-password-page/change-password-page.component'
              ).then((c) => c.ChangePasswordPageComponent),
          },
          {
            path: 'get-support',
            loadComponent: () =>
              import('../get-support-page/get-support-page.component').then(
                (g) => g.GetSupportPageComponent
              ),
          },
          {
            path: 'time-table',
            loadComponent: () =>
              import('../time-table-page/time-table-page.component').then(
                (t) => t.TimeTablePageComponent
              ),
          },
          {
            path: 'results',
            loadComponent: () =>
              import('../results-page/results-page.component').then(
                (r) => r.ResultsPageComponent
              ),
            children: [
              {
                path: '',
                loadComponent: () =>
                  import(
                    '../../components/templates/exam-types-list/exam-types-list.component'
                  ).then((e) => e.ExamTypesListComponent),
              },
              {
                path: ':examType',
                loadComponent: () =>
                  import(
                    '../../components/templates/student-marks/student-marks.component'
                  ).then((s) => s.StudentMarksComponent),
              },
            ],
          },
          {
            path: 'fees',
            loadComponent: () =>
              import('../fees-page/fees-page.component').then(
                (c) => c.FeesPageComponent
              ),
          },
          {
            path: 'attendance',
            loadComponent: () =>
              import('../attendance-page/attendance-page.component').then(
                (c) => c.AttendancePageComponent
              ),
          },
        ],
      },
    ],
  },
];
