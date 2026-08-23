export interface DashboardEntity {
  entityId: string;
  domain: string;
  name: string;

  areaId: string | null;
  deviceId: string | null;
}

export interface DashboardArea {
  id: string;
  name: string;
  icon: string | null;

  entities: DashboardEntity[];
}

export interface DashboardModel {
  areas: DashboardArea[];
  unassigned: DashboardEntity[];
}