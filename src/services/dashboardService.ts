interface Dashboard {
  id: string;
  name: string;
  accounts: string[]; // IDs das contas do Facebook Ads
  createdAt: string;
  updatedAt: string;
}

// Por enquanto, vamos usar localStorage para persistir os dados
// Em uma aplicação real, isso seria feito em um backend
export const DashboardService = {
  getAll: (): Dashboard[] => {
    const dashboards = localStorage.getItem('dashboards');
    return dashboards ? JSON.parse(dashboards) : [];
  },

  getById: (id: string): Dashboard | null => {
    const dashboards = DashboardService.getAll();
    return dashboards.find(d => d.id === id) || null;
  },

  create: (name: string, accounts: string[]): Dashboard => {
    const dashboards = DashboardService.getAll();
    const newDashboard: Dashboard = {
      id: crypto.randomUUID(),
      name,
      accounts,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dashboards.push(newDashboard);
    localStorage.setItem('dashboards', JSON.stringify(dashboards));
    return newDashboard;
  },

  update: (id: string, data: Partial<Dashboard>): Dashboard => {
    const dashboards = DashboardService.getAll();
    const index = dashboards.findIndex(d => d.id === id);
    
    if (index === -1) {
      throw new Error('Dashboard não encontrado');
    }

    const updatedDashboard = {
      ...dashboards[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    dashboards[index] = updatedDashboard;
    localStorage.setItem('dashboards', JSON.stringify(dashboards));
    return updatedDashboard;
  },

  delete: (id: string): void => {
    const dashboards = DashboardService.getAll();
    const filtered = dashboards.filter(d => d.id !== id);
    localStorage.setItem('dashboards', JSON.stringify(filtered));
  },

  addAccount: (dashboardId: string, accountId: string): Dashboard => {
    const dashboard = DashboardService.getById(dashboardId);
    if (!dashboard) {
      throw new Error('Dashboard não encontrado');
    }

    if (!dashboard.accounts.includes(accountId)) {
      dashboard.accounts.push(accountId);
      return DashboardService.update(dashboardId, { accounts: dashboard.accounts });
    }

    return dashboard;
  },

  removeAccount: (dashboardId: string, accountId: string): Dashboard => {
    const dashboard = DashboardService.getById(dashboardId);
    if (!dashboard) {
      throw new Error('Dashboard não encontrado');
    }

    dashboard.accounts = dashboard.accounts.filter(id => id !== accountId);
    return DashboardService.update(dashboardId, { accounts: dashboard.accounts });
  },
}; 