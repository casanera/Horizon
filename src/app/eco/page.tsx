"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search, Radio, Plus, Trash2, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Sensor, INITIAL_SENSORS } from "@/lib/data";

export default function EcoPage() {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSensorName, setNewSensorName] = useState("");
  const [newSensorLoc, setNewSensorLoc] = useState("");
  const [newSensorType, setNewSensorType] = useState<string>("PM2.5");

  useEffect(() => {
    const saved = localStorage.getItem("horizon_sensors");
    if (saved) {
      setSensors(JSON.parse(saved));
    } else {
      setSensors(INITIAL_SENSORS);
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("horizon_sensors", JSON.stringify(sensors));
    }
  }, [sensors, isMounted]);

  // живые цифоры КОГДА НИБУДЬ ЭТА ПОМОЙКА ЗАРАБОТАЕТ
  useEffect(() => {
    const interval = setInterval(() => {
      setSensors((prev) =>
        prev.map((s) => ({
          ...s,
          value: Math.max(0, s.value + Math.floor(Math.random() * 5) - 2),
        }))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleAddSensor = () => {
    if (!newSensorName || !newSensorLoc) {
        toast.error("Заполните название и локацию!");
        return;
    }

    const newSensor: Sensor = {
        id: Date.now().toString(),
        name: newSensorName,
        location: newSensorLoc,
        type: newSensorType as Sensor["type"],
        value: Math.floor(Math.random() * 100),
        unit: newSensorType === "CO2" ? "ppm" : "µg/m³",
        status: "Online",
        color: "bg-emerald-500"
    };

    setSensors([newSensor, ...sensors]);
    toast.success("Датчик успешно подключен к сети");
    
    setNewSensorName("");
    setNewSensorLoc("");
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSensors(sensors.filter(s => s.id !== id));
    toast.info("Датчик отключен и удален");
  };

  const filteredSensors = sensors.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isMounted) return null;

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Radio className="h-8 w-8 text-blue-500 animate-pulse" />
            ЭкоМонитор
          </h1>
          <p className="text-slate-400 mt-1">Управление сетью датчиков IoT</p>
        </div>
        
        <div className="flex gap-2">
             <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 transition-all hover:scale-105 active:scale-95">
                        <Plus className="mr-2 h-4 w-4" /> Добавить датчик
                    </Button>
                </DialogTrigger>
                <DialogContent className="bg-horizon-card border-slate-800 text-white">
                    <DialogHeader>
                        <DialogTitle>Подключение нового устройства</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Название</Label>
                            <Input 
                                value={newSensorName}
                                onChange={(e) => setNewSensorName(e.target.value)}
                                className="col-span-3 bg-slate-950 border-slate-700" 
                                placeholder="Например: Датчик #205" 
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Локация</Label>
                            <Input 
                                value={newSensorLoc}
                                onChange={(e) => setNewSensorLoc(e.target.value)}
                                className="col-span-3 bg-slate-950 border-slate-700" 
                                placeholder="Например: Центральная площадь" 
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Тип</Label>
                            <Select onValueChange={setNewSensorType} defaultValue="PM2.5">
                                <SelectTrigger className="col-span-3 bg-slate-950 border-slate-700">
                                    <SelectValue placeholder="Выберите тип" />
                                </SelectTrigger>
                                <SelectContent className="bg-horizon-card border-slate-800 text-white">
                                    <SelectItem value="PM2.5">PM2.5 (Пыль)</SelectItem>
                                    <SelectItem value="CO2">CO2 (Углекислый газ)</SelectItem>
                                    <SelectItem value="NO2">NO2 (Азот)</SelectItem>
                                    <SelectItem value="Radiation">Радиация</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-slate-700 text-slate-300">Отмена</Button>
                        <Button onClick={handleAddSensor} className="bg-blue-600 hover:bg-blue-500">Подключить</Button>
                    </DialogFooter>
                </DialogContent>
             </Dialog>
        </div>
      </div>

      <div className="grid h-full grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-4 h-[calc(100vh-200px)]">
          <Card className="border-slate-800 bg-horizon-card shrink-0">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-400">Поиск по сети</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Найти датчик или улицу..." 
                className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-600 focus-visible:ring-blue-600" 
              />
              <Button size="icon" className="bg-slate-800 hover:bg-slate-700">
                <Search className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="flex-1 border-slate-800 bg-horizon-card overflow-hidden flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-800/50 shrink-0">
              <CardTitle className="text-lg text-white">IoT Устройства ({filteredSensors.length})</CardTitle>
              <Badge variant="outline" className="border-emerald-500 text-emerald-500 bg-emerald-500/10">
                Live Data
              </Badge>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 pt-4 overflow-y-auto pr-2 custom-scrollbar">
              {filteredSensors.length === 0 ? (
                  <div className="text-center py-10 text-slate-500">
                      Ничего не найдено
                  </div>
              ) : (
                filteredSensors.map((sensor) => (
                    <div 
                        key={sensor.id} 
                        className="group relative flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/50 p-4 transition-all hover:bg-slate-800/80 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-900/10 cursor-default"
                    >
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className={`h-2.5 w-2.5 rounded-full ${sensor.color}`} />
                            <div className={`absolute inset-0 h-2.5 w-2.5 rounded-full ${sensor.color} animate-ping opacity-75`} />
                        </div>
                        <div>
                        <p className="font-medium text-white text-sm">{sensor.name}</p>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                            <MapPin className="h-3 w-3" />
                            {sensor.location}
                        </div>
                        </div>
                    </div>
                    <div className="text-right mr-6">
                        <p className={`text-lg font-bold font-mono ${sensor.value > 50 && sensor.type === 'NO2' ? 'text-amber-500' : 'text-emerald-400'}`}>
                        {sensor.value} <span className="text-xs text-slate-600 font-normal">{sensor.unit}</span>
                        </p>
                        <p className="text-[10px] text-slate-500 uppercase">{sensor.type}</p>
                    </div>

                    <button 
                        onClick={(e) => handleDelete(sensor.id, e)}
                        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-500/20 rounded text-slate-500 hover:text-red-500"
                        title="Удалить датчик"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                    </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="flex items-center justify-center overflow-hidden border-slate-800 bg-slate-900/30 lg:col-span-8 h-[calc(100vh-200px)] relative group">
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-blue-500 to-transparent opacity-30 animate-[scan_4s_ease-in-out_infinite] z-20"></div>
            
            <div className="absolute inset-0" 
                style={{
                    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            ></div>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
                 <div className="h-48 w-48 rounded-full border border-blue-500/20 flex items-center justify-center animate-[spin_20s_linear_infinite]">
                    <div className="h-32 w-32 rounded-full border border-blue-400/30 border-dashed"></div>
                 </div>
                 <div className="absolute mt-56 text-center">
                     <h3 className="text-xl font-medium text-slate-400">Карта покрытия</h3>
                     <p className="text-slate-600 text-sm mt-2">Выделите датчик в списке для отображения телеметрии</p>
                 </div>
            </div>
            
            <div className="absolute inset-0 bg-linear-to-t from-horizon-bg via-transparent to-transparent opacity-80" />
        </Card>
      </div>
    </div>
  );
}