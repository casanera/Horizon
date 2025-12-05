"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trees, Droplets, Search, ArrowRightLeft, Leaf, AlertTriangle, MapPin } from "lucide-react";
import { toast } from "sonner";

type GreenZone = {
  id: string;
  name: string;
  type: "Парк" | "Сквер" | "Лесопарк";
  health: number; // 0-100%
  soilMoisture: number; // 0-100%
  treesCount: number;
  area: number; // гектары
  status: "Normal" | "Warning" | "Critical";
};

// --- МОК ---
const ZONES_DATA: GreenZone[] = [
  { id: "1", name: "Парк Победы", type: "Парк", health: 92, soilMoisture: 65, treesCount: 1250, area: 15.5, status: "Normal" },
  { id: "2", name: "Сквер Южный", type: "Сквер", health: 45, soilMoisture: 20, treesCount: 120, area: 1.2, status: "Warning" },
  { id: "3", name: "Роща Соловьиная", type: "Лесопарк", health: 88, soilMoisture: 70, treesCount: 5400, area: 42.0, status: "Normal" },
  { id: "4", name: "Аллея Славы", type: "Сквер", health: 30, soilMoisture: 15, treesCount: 80, area: 0.8, status: "Critical" },
  { id: "5", name: "Ботанический Сад", type: "Парк", health: 98, soilMoisture: 85, treesCount: 3200, area: 25.0, status: "Normal" },
  { id: "6", name: "Парк Дружбы", type: "Парк", health: 75, soilMoisture: 45, treesCount: 950, area: 8.5, status: "Warning" },
];

export default function GreenPage() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Логика фильтрации
  const filteredZones = ZONES_DATA.filter((zone) => {
    const matchesSearch = zone.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "All" || zone.status === filterType;
    return matchesSearch && matchesType;
  });

  // логика выбора для сравнения
  const toggleSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      if (selectedIds.length >= 3) {
        toast.error("Можно сравнить максимум 3 объекта");
        return;
      }
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectedZones = ZONES_DATA.filter((z) => selectedIds.includes(z.id));

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Trees className="h-8 w-8 text-emerald-500" />
            Зеленый Город
          </h1>
          <p className="text-slate-400 mt-1">Мониторинг состояния зеленых насаждений</p>
        </div>
        
        {/* Кнопка сравнения */}
        {selectedIds.length > 0 && (
          <Button 
            onClick={() => setIsCompareOpen(true)}
            className="bg-blue-600 hover:bg-blue-500 animate-in fade-in zoom-in"
          >
            <ArrowRightLeft className="mr-2 h-4 w-4" />
            Сравнить ({selectedIds.length})
          </Button>
        )}
      </div>

      {/* --- ФИЛЬТРЫ --- */}
      <Card className="bg-horizon-card border-slate-800 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Поиск парка..."
              className="pl-9 bg-slate-950 border-slate-700 text-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="w-full md:w-[200px]">
             <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="bg-slate-950 border-slate-700 text-white">
                    <SelectValue placeholder="Статус" />
                </SelectTrigger>
                <SelectContent className="bg-horizon-card border-slate-800 text-white">
                    <SelectItem value="All">Все статусы</SelectItem>
                    <SelectItem value="Normal">В норме</SelectItem>
                    <SelectItem value="Warning">Требует внимания</SelectItem>
                    <SelectItem value="Critical">Критично</SelectItem>
                </SelectContent>
             </Select>
          </div>
        </div>
      </Card>

      {/* --- СЕТКА КАРТОЧЕК --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
        {filteredZones.map((zone) => (
          <Card 
            key={zone.id} 
            className={`bg-horizon-card border-slate-800 transition-all hover:border-slate-600 relative overflow-hidden group
                ${selectedIds.includes(zone.id) ? 'ring-2 ring-blue-500 border-transparent' : ''}
            `}
          >
            {/* Чекбокс */}
            <div className="absolute top-4 right-4 z-10">
                <Checkbox 
                    checked={selectedIds.includes(zone.id)}
                    onCheckedChange={() => toggleSelection(zone.id)}
                    className="h-5 w-5 border-slate-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
            </div>

            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                  <div>
                    <Badge variant="outline" className="mb-2 text-slate-400 border-slate-700 bg-slate-900/50">
                        {zone.type}
                    </Badge>
                    <CardTitle className="text-xl text-white">{zone.name}</CardTitle>
                  </div>
              </div>
              <CardDescription className="flex items-center gap-1">
                 <MapPin className="h-3 w-3" /> Сектор {zone.id}0{zone.id} • {zone.area} га
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
                {/* ХП */}
                <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Индекс здоровья</span>
                        <span className={`font-bold ${
                            zone.health > 80 ? 'text-emerald-500' : 
                            zone.health > 50 ? 'text-amber-500' : 'text-red-500'
                        }`}>
                            {zone.health}%
                        </span>
                    </div>
                    <Progress value={zone.health} className="h-2 bg-slate-800" />
                </div>

                {/* Статистика */}
                <div className="grid grid-cols-2 gap-2 mt-4">
                    <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800 flex items-center gap-2">
                        <Leaf className="h-8 w-8 text-emerald-600 p-1.5 bg-emerald-500/10 rounded-md" />
                        <div>
                            <p className="text-xs text-slate-500">Деревьев</p>
                            <p className="font-bold text-white">{zone.treesCount}</p>
                        </div>
                    </div>
                    <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800 flex items-center gap-2">
                        <Droplets className="h-8 w-8 text-blue-600 p-1.5 bg-blue-500/10 rounded-md" />
                        <div>
                            <p className="text-xs text-slate-500">Влага</p>
                            <p className="font-bold text-white">{zone.soilMoisture}%</p>
                        </div>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="pt-0">
                {zone.status === "Normal" && (
                    <div className="w-full py-2 px-3 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-400 text-sm flex items-center gap-2">
                        <Leaf className="h-4 w-4" /> Состояние в норме
                    </div>
                )}
                {zone.status === "Warning" && (
                    <div className="w-full py-2 px-3 bg-amber-500/10 border border-amber-500/20 rounded text-amber-400 text-sm flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" /> Требуется полив
                    </div>
                )}
                {zone.status === "Critical" && (
                    <div className="w-full py-2 px-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" /> Санитарная вырубка
                    </div>
                )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* --- ОКНО СРАВНЕНИЯ --- */}
      <Dialog open={isCompareOpen} onOpenChange={setIsCompareOpen}>
       <DialogContent className="bg-slate-950 border-slate-800 text-white max-w-4xl shadow-2xl z-[9999]">
            <DialogHeader>
                <DialogTitle>Сравнение объектов</DialogTitle>
                <DialogDescription>Анализ показателей эффективности зеленых зон</DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-4 gap-4 mt-4 border-t border-slate-800 pt-4">
                {/* КОлонка заголовков */}
                <div className="col-span-1 space-y-6 pt-12 text-slate-400 font-medium text-sm">
                    <p>Тип объекта</p>
                    <p>Площадь</p>
                    <p>Количество деревьев</p>
                    <p>Индекс здоровья</p>
                    <p>Влажность почвы</p>
                    <p>Текущий статус</p>
                </div>

                {/* колонки данных */}
                {selectedZones.map(zone => (
                    <div key={zone.id} className="col-span-1 space-y-6 text-center border-l border-slate-800/50">
                         <div className="h-10 flex items-center justify-center font-bold text-blue-400">
                             {zone.name}
                         </div>
                         <p className="text-white">{zone.type}</p>
                         <p className="text-white">{zone.area} га</p>
                         <p className="text-white font-mono">{zone.treesCount}</p>
                         <div className="flex justify-center">
                             <Badge className={
                                 zone.health > 80 ? "bg-emerald-500" : zone.health > 50 ? "bg-amber-500" : "bg-red-500"
                             }>
                                 {zone.health}%
                             </Badge>
                         </div>
                         <p className="text-blue-300">{zone.soilMoisture}%</p>
                         <div className="text-xs">{zone.status === 'Normal' ? '✅ Норма' : '⚠️ Внимание'}</div>
                    </div>
                ))}

                {/* пустые слоты, если выбрано меньше 3 */}
                {[...Array(3 - selectedZones.length)].map((_, i) => (
                    <div key={i} className="col-span-1 border-l border-slate-800/50 flex items-center justify-center opacity-20">
                        <div className="text-center">
                            <div className="h-12 w-12 rounded-full border-2 border-dashed border-slate-500 mx-auto mb-2"></div>
                            <p>Слот пуст</p>
                        </div>
                    </div>
                ))}
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}