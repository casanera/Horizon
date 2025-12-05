"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertTriangle, CloudRain, Wind, Trash2, X, Clock, Calendar } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from "sonner";

// --- ДАННЫЕ ДЛЯ ГРАФИКОВ ---
const data24h = [
  { time: "00:00", value: 30 }, { time: "04:00", value: 25 }, { time: "08:00", value: 65 },
  { time: "12:00", value: 95 }, { time: "16:00", value: 85 }, { time: "20:00", value: 55 }, { time: "23:59", value: 40 },
];

const data7d = [
  { time: "Пн", value: 40 }, { time: "Вт", value: 55 }, { time: "Ср", value: 35 },
  { time: "Чт", value: 70 }, { time: "Пт", value: 90 }, { time: "Сб", value: 65 }, { time: "Вс", value: 50 },
];

const data30d = [
  { time: "Нед 1", value: 60 }, { time: "Нед 2", value: 45 }, { time: "Нед 3", value: 80 }, { time: "Нед 4", value: 75 },
];
type Notification = {
  id: number;
  title: string;
  desc: string;
  time: string;
  type: "danger" | "success" | "info";
};

export default function Home() {
  const [chartRange, setChartRange] = useState<"24h" | "7d" | "30d">("24h");
  
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, title: "Критическое превышение CO2", desc: "Район Центральный, Датчик #102.", time: "2м назад", type: "danger" },
    { id: 2, title: "Система восстановлена", desc: "Сервер работает штатно.", time: "15м назад", type: "success" },
    { id: 3, title: "Обновление прошивки", desc: "Успешно обновлено до v2.4.", time: "1ч назад", type: "info" },
  ]);

  // ЛОггика переключения данных графика
  const currentData = chartRange === "24h" ? data24h : chartRange === "7d" ? data7d : data30d;

  // Функция удаления увед
  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Функция очистки всех увед
  const clearAllNotifications = () => {
    if (notifications.length === 0) return;
    setNotifications([]);
    toast.success("Журнал уведомлений очищен");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Обзор системы</h2>
        <p className="text-horizon-muted">Сводка данных по всем модулям города в реальном времени.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        
        {/* Карточка 1 */}
        <Card className="bg-horizon-card border-slate-800 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-500/50 cursor-pointer group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400 group-hover:text-emerald-400 transition-colors">Качество воздуха</CardTitle>
            <Wind className="h-4 w-4 text-emerald-500 group-hover:scale-125 transition-transform duration-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Good</div>
            <p className="text-xs text-slate-500 group-hover:text-emerald-500/80 transition-colors">AQI Index: 42</p>
          </CardContent>
        </Card>

        {/* Карточка 2 */}
        <Card className="bg-horizon-card border-slate-800 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-500/50 cursor-pointer group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400 group-hover:text-blue-400 transition-colors">Нагрузка сети</CardTitle>
            <Activity className="h-4 w-4 text-blue-500 group-hover:scale-125 transition-transform duration-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-slate-500 group-hover:text-blue-500/80 transition-colors">Активных датчиков</p>
          </CardContent>
        </Card>

        {/* Карточка 3 */}
        <Card className="bg-horizon-card border-slate-800 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/10 hover:border-amber-500/50 cursor-pointer group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400 group-hover:text-amber-400 transition-colors">Инциденты</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500 group-hover:rotate-12 transition-transform duration-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-slate-500 group-hover:text-amber-500/80 transition-colors">Требуют внимания</p>
          </CardContent>
        </Card>

        {/* Карточка 4 */}
        <Card className="bg-horizon-card border-slate-800 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10 hover:border-cyan-500/50 cursor-pointer group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400 group-hover:text-cyan-400 transition-colors">Погода</CardTitle>
            <CloudRain className="h-4 w-4 text-cyan-500 group-hover:scale-125 transition-transform duration-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+18°C</div>
            <p className="text-xs text-slate-500 group-hover:text-cyan-500/80 transition-colors">Небольшой дождь</p>
          </CardContent>
        </Card>
      </div>

      {/* --- ГРАФИК И ЛОГИ --- */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        
        {/*  ГРАФИК */}
        <Card className="col-span-4 bg-horizon-card border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-white">Активность датчиков</CardTitle>
            {/* Кнопки переключения */}
            <div className="flex gap-1 bg-slate-900/50 p-1 rounded-lg border border-slate-800">
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setChartRange("24h")}
                    className={`h-7 px-3 text-xs ${chartRange === "24h" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}
                >
                    <Clock className="mr-1 h-3 w-3" /> 24ч
                </Button>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setChartRange("7d")}
                    className={`h-7 px-3 text-xs ${chartRange === "7d" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}
                >
                     <Calendar className="mr-1 h-3 w-3" /> 7дн
                </Button>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setChartRange("30d")}
                    className={`h-7 px-3 text-xs ${chartRange === "30d" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}
                >
                    30дн
                </Button>
            </div>
          </CardHeader>
          <CardContent className="pl-0 pt-4">
             <div className="h-[250px] w-full transition-all duration-500 ease-in-out">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={currentData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis 
                        dataKey="time" 
                        stroke="#64748B" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                    />
                    <YAxis 
                        stroke="#64748B" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                        tickFormatter={(value: number) => `${value}%`} 
                    />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }}
                        itemStyle={{ color: '#3B82F6' }}
                    />
                    <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#3B82F6" 
                        strokeWidth={3} 
                        fillOpacity={1} 
                        fill="url(#colorValue)" 
                        animationDuration={1000} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </CardContent>
        </Card>

        {/* ИНТЕРАКТИВЧИКИ (УВЕДы) */}
        <Card className="col-span-3 bg-horizon-card border-slate-800 flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                    <CardTitle className="text-white">Уведомления</CardTitle>
                    {notifications.length > 0 && <Badge variant="secondary" className="bg-blue-600/20 text-blue-400 hover:bg-blue-600/30">{notifications.length}</Badge>}
                </div>
                {/* кнопка очистки */}
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={clearAllNotifications}
                    className="h-8 w-8 text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    disabled={notifications.length === 0}
                    title="Очистить журнал"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {notifications.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-slate-500 space-y-2 opacity-0 animate-in fade-in zoom-in duration-500 fill-mode-forwards">
                        <div className="h-12 w-12 rounded-full bg-slate-800/50 flex items-center justify-center">
                            <Clock className="h-6 w-6 text-slate-600" />
                        </div>
                        <p className="text-sm">Журнал событий пуст</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {notifications.map((notif) => (
                            <div key={notif.id} className="group flex items-start p-3 rounded-lg border border-transparent hover:border-slate-800 hover:bg-slate-900/50 transition-all relative animate-in slide-in-from-right-5 duration-300">
                                {/* индикатор цвета */}
                                <span className={`mt-1.5 h-2 w-2 rounded-full mr-3 shadow-[0_0_8px_rgba(0,0,0,0.5)] 
                                    ${notif.type === 'danger' ? 'bg-red-500 shadow-red-500/50' : 
                                      notif.type === 'success' ? 'bg-emerald-500 shadow-emerald-500/50' : 
                                      'bg-blue-500 shadow-blue-500/50'}`}
                                ></span>
                                
                                <div className="space-y-1 pr-6">
                                    <p className="text-sm font-medium text-white">{notif.title}</p>
                                    <p className="text-xs text-slate-500 leading-relaxed">{notif.desc}</p>
                                    <p className="text-[10px] text-slate-600 font-mono pt-1">{notif.time}</p>
                                </div>
                                <button 
                                    onClick={() => removeNotification(notif.id)}
                                    className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-600 hover:text-white p-1"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}