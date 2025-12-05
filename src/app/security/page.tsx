"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ShieldAlert, ShieldCheck, Cctv, Plane, Terminal, AlertOctagon, Lock, Play, Pause } from "lucide-react";
import { toast } from "sonner";

type Drone = {
  id: string;
  name: string;
  status: "Patrol" | "Docked" | "Charging";
  battery: number;
};

type LogEntry = {
  id: number;
  time: string;
  message: string;
  type: "info" | "warning" | "danger";
};

export default function SecurityPage() {
  // --- СОСТОЯНИЯ ---
  const [lockdown, setLockdown] = useState(false);
  
  // дроны
  const [drones, setDrones] = useState<Drone[]>([
    { id: "D-01", name: "Alpha Squad", status: "Patrol", battery: 78 },
    { id: "D-02", name: "Bravo Squad", status: "Docked", battery: 100 },
    { id: "D-03", name: "Charlie Squad", status: "Patrol", battery: 45 },
  ]);

  const [logs, setLogs] = useState<LogEntry[]>([]);

  // камеры вкл выкл
  const [activeCameras, setActiveCameras] = useState([true, true, true, false]);

  // симуляция батарейки
  useEffect(() => {
    const timer = setInterval(() => {
      setDrones(prev => prev.map(d => {
        if (d.status === "Patrol") {
          return { ...d, battery: Math.max(0, d.battery - 1) };
        } else if (d.status === "Charging" || d.status === "Docked") {
          return { ...d, battery: Math.min(100, d.battery + 2) };
        }
        return d;
      }));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // 2. Генератор логов (хацкер стайл)
  useEffect(() => {
    const messages = [
      { msg: "Сканирование сектора 7G...", type: "info" },
      { msg: "Лицо распознано: ID #9382", type: "info" },
      { msg: "Движение в запретной зоне", type: "warning" },
      { msg: "Пакет данных зашифрован", type: "info" },
      { msg: "Сбой сенсора C-12", type: "danger" },
      { msg: "Патруль прибыл на точку", type: "success" },
    ];

    const timer = setInterval(() => {
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      const newLog = {
        id: Date.now(),
        time: new Date().toLocaleTimeString('ru-RU'),
        message: randomMsg.msg,
        type: randomMsg.type as LogEntry["type"]
      };
      setLogs(prev => [newLog, ...prev].slice(0, 20)); // сейв последних 20 чтобы не взорваться
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  // --- ФУНКЦИИ ---

  const toggleDrone = (id: string) => {
    setDrones(prev => prev.map(d => {
      if (d.id === id) {
        const newStatus = d.status === "Patrol" ? "Docked" : "Patrol";
        toast.info(`${d.name}: статус изменен на ${newStatus}`);
        return { ...d, status: newStatus };
      }
      return d;
    }));
  };

  const toggleLockdown = () => {
    setLockdown(!lockdown);
    if (!lockdown) {
      toast.error("ВНИМАНИЕ: АКТИВИРОВАН РЕЖИМ БЛОКИРОВКИ", { duration: 3000 });
    } else {
      toast.success("Режим блокировки снят");
    }
  };

  return (
    <div className={`space-y-6 h-full transition-colors duration-700 ${lockdown ? "bg-red-950/10" : ""}`}>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            {lockdown ? <ShieldAlert className="h-8 w-8 text-red-500 animate-pulse" /> : <ShieldCheck className="h-8 w-8 text-blue-500" />}
            Система &quot;Страж&quot;
          </h1>
          <p className="text-slate-400 mt-1">
             Центр управления безопасностью 
             {lockdown && <span className="ml-2 text-red-500 font-bold animate-pulse">● CODE RED</span>}
          </p>
        </div>
        
        <Button 
            onClick={toggleLockdown}
            variant={lockdown ? "destructive" : "outline"}
            className={`h-12 px-6 border-2 font-bold transition-all ${lockdown ? "animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.5)]" : "border-red-900/50 hover:bg-red-900/20 text-red-400"}`}
        >
            {lockdown ? <><Lock className="mr-2" /> СНЯТЬ БЛОКИРОВКУ</> : <><AlertOctagon className="mr-2" /> РЕЖИМ ТРЕВОГИ</>}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* --- камеры и дроны (лево) */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* камеры */}
            <div className="grid grid-cols-2 gap-4">
                {activeCameras.map((isActive, idx) => (
                    <Card key={idx} className={`relative bg-black border-slate-800 overflow-hidden group aspect-video ${lockdown ? 'border-red-900' : ''}`}>
                        {isActive ? (
                            <>
                                {/* градиент изобр. */}
                                <div className="absolute inset-0 bg-linear-to-br from-slate-800 to-slate-900 opacity-50"></div>
                                {/* сетка  */}
                                <div className="absolute inset-0 opacity-10" 
                                     style={{backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(32, 255, 77, .1) 25%, rgba(32, 255, 77, .1) 26%, transparent 27%, transparent 74%, rgba(32, 255, 77, .1) 75%, rgba(32, 255, 77, .1) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(32, 255, 77, .1) 25%, rgba(32, 255, 77, .1) 26%, transparent 27%, transparent 74%, rgba(32, 255, 77, .1) 75%, rgba(32, 255, 77, .1) 76%, transparent 77%, transparent)', backgroundSize: '50px 50px'}}>
                                </div>
                                <div className="absolute top-2 left-3 flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                                    <span className="text-xs font-mono text-red-500 font-bold">REC</span>
                                </div>
                                <div className="absolute bottom-2 left-3 text-xs font-mono text-white/70">
                                    CAM-0{idx + 1} {'//'} SECTOR-{10 + idx}
                                </div>
                                {/* фамка фокуса */}
                                <div className="absolute inset-0 border-2 border-white/10 m-8 rounded opacity-20 group-hover:opacity-50 transition-opacity flex items-center justify-center">
                                    <span className="text-white/10 text-4xl">+</span>
                                </div>
                            </>
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 text-slate-600">
                                <Cctv className="h-10 w-10 mb-2 opacity-20" />
                                <span className="text-xs font-mono">NO SIGNAL</span>
                            </div>
                        )}
                        {/* кнопка вкл/выкл */}
                        <button 
                            onClick={() => {
                                const newCams = [...activeCameras];
                                newCams[idx] = !newCams[idx];
                                setActiveCameras(newCams);
                            }}
                            className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-white/10 rounded text-white/50 hover:text-white transition-colors"
                        >
                            {isActive ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                        </button>
                    </Card>
                ))}
            </div>

            {/* управление дронами */}
            <Card className={`bg-horizon-card border-slate-800 ${lockdown ? 'border-red-900/50 bg-red-950/10' : ''}`}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                        <Plane className="h-5 w-5 text-blue-500" /> Отряд Дронов
                    </CardTitle>
                </CardHeader>
                <div className="p-6 pt-0 grid gap-4"> 
                    {drones.map(drone => (
                        <div key={drone.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-950/50">
                            <div className="flex items-center gap-4">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${drone.status === 'Patrol' ? 'bg-blue-600/20 text-blue-500' : 'bg-slate-800 text-slate-400'}`}>
                                    <Plane className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-bold text-white text-sm">{drone.name}</p>
                                    <p className="text-xs text-slate-500 flex items-center gap-1">
                                        ID: {drone.id} • 
                                        <span className={drone.status === 'Patrol' ? 'text-blue-400' : 'text-slate-400'}>
                                            {drone.status === 'Patrol' ? 'В патруле' : 'На базе'}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-6">
                                {/* батарейка */}
                                <div className="w-32 space-y-1">
                                    <div className="flex justify-between text-[10px] text-slate-400">
                                        <span>BATTERY</span>
                                        <span className={drone.battery < 20 ? 'text-red-500' : 'text-emerald-500'}>{drone.battery}%</span>
                                    </div>
                                    <Progress value={drone.battery} className={`h-1.5 ${drone.battery < 20 ? 'bg-red-900' : 'bg-slate-800'}`} />
                                </div>

                                {/* действ */}
                                <Button 
                                    size="sm" 
                                    variant={drone.status === 'Patrol' ? "secondary" : "default"}
                                    onClick={() => toggleDrone(drone.id)}
                                    className={drone.status === 'Patrol' ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-blue-600 hover:bg-blue-500"}
                                >
                                    {drone.status === 'Patrol' ? 'Вернуть' : 'Запуск'}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>

        {/* --- лог ии --- */}
        <div className="lg:col-span-1">
            <Card className={`h-full border-slate-800 bg-black font-mono text-xs flex flex-col ${lockdown ? 'border-red-900 shadow-[0_0_30px_rgba(239,68,68,0.1)]' : ''}`}>
                <CardHeader className="border-b border-slate-800 py-3 bg-slate-900/50">
                    <CardTitle className="text-white text-sm flex items-center gap-2">
                        <Terminal className="h-4 w-4 text-emerald-500" />
                        AI_VISION_LOGS
                    </CardTitle>
                </CardHeader>
                <div className="flex-1 overflow-hidden relative">
                     {/* пажилой сканлайн*/}
                     <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 pointer-events-none bg-size-[100%_2px,3px_100%]"></div>
                     
                     <div className="p-4 space-y-3 h-[600px] overflow-y-auto custom-scrollbar flex flex-col-reverse">
                        {logs.map((log) => (
                            <div key={log.id} className="animate-in fade-in slide-in-from-left-2 duration-300 border-l-2 border-slate-800 pl-2 py-1">
                                <span className="text-slate-500 mr-2">[{log.time}]</span>
                                <span className={
                                    log.type === 'danger' ? 'text-red-500 font-bold' :
                                    log.type === 'warning' ? 'text-amber-500' :
                                    'text-emerald-500'
                                }>
                                    {log.message}
                                </span>
                            </div>
                        ))}
                     </div>
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
}