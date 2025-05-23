export interface CPUData {
  data: {
    time: string;
    load: number;
    memory: number;
    threads: number;
  }[];
  service_name: string;
}

export type MockedCPUData = Record<string, Record<string, CPUData[]>>;

export interface Service {
  id?: string;
  name: string;
  port?: number;
  url?: string;
  status?: 'Running' | 'Stopped' | 'Error' | 'Online' | 'Offline';
  health?: 'Healthy' | 'Warning' | 'Critical' | 'Degraded' | 'Error';
  uptime?: string;
  version?: string;
  lastDeployment?: string;
}

export type MockedServices = Record<string, Service[]>;

export type Severity = 'debug' | 'info' | 'warn' | 'error';

export interface Log {
  id: string;
  project_id: string;
  service_id: string;
  test_id?: string;
  func_id?: string;
  message: string;
  severity: Severity;
  timestamp: string;
  source?: string;
}

export interface Project {
  id: string;
  name: string;
  path: string;
}

export type Tab = {
  id: string;
  name: string;
  icon: React.ComponentType<React.ComponentProps<'svg'>>; // Allow SVG props including className
};

export interface Metric {
  id: string;
  name: string;
  dataKey: string;
  color: string;
  selected: boolean;
}
