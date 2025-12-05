export type Sensor = {
  id: string;
  name: string;
  location: string;
  type: "PM2.5" | "CO2" | "NO2" | "Radiation";
  value: number;
  unit: string;
  status: "Online" | "Offline";
  color: string;
};

// если localStorage пуст
export const INITIAL_SENSORS: Sensor[] = [
  { id: "101", name: "Датчик #101", location: "Парк Победы", type: "PM2.5", value: 12, unit: "µg/m³", status: "Online", color: "bg-emerald-500" },
  { id: "102", name: "Датчик #102", location: "ТЦ Панфиловский", type: "CO2", value: 420, unit: "ppm", status: "Online", color: "bg-emerald-500" },
  { id: "103", name: "Датчик #103", location: "Промзона А", type: "NO2", value: 45, unit: "ppb", status: "Online", color: "bg-amber-500" },
];