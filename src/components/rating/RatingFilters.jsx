import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Calendar, Trophy, Target, Award, TrendingUp } from 'lucide-react';
import { RATING_PERIODS } from '@/hooks/useRating';

/**
 * Фильтры для рейтинговой таблицы
 * @param {string} period - выбранный период
 * @param {Function} onPeriodChange - callback для изменения периода
 * @param {string} category - выбранная категория
 * @param {Function} onCategoryChange - callback для изменения категории
 */
export const RatingFilters = ({
  period = RATING_PERIODS.ALL_TIME,
  onPeriodChange,
  category = 'all',
  onCategoryChange
}) => {
  const periods = [
    { value: RATING_PERIODS.ALL_TIME, label: 'Всё время', icon: Trophy },
    { value: RATING_PERIODS.YEAR, label: 'За год', icon: Calendar },
    { value: RATING_PERIODS.MONTH, label: 'За месяц', icon: Clock },
  ];

  const categories = [
    { value: 'all', label: 'Все категории', icon: Trophy },
    { value: 'sport', label: 'Спорт', icon: Trophy },
    { value: 'study', label: 'Учёба', icon: Target },
    { value: 'creativity', label: 'Творчество', icon: Award },
    { value: 'volunteer', label: 'Волонтёрство', icon: TrendingUp },
  ];

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Period Filter - Tabs for Desktop */}
          <div>
            <label className="text-sm font-medium mb-2 block">Период</label>
            <div className="hidden md:block">
              <Tabs value={period} onValueChange={onPeriodChange}>
                <TabsList className="grid w-full grid-cols-3">
                  {periods.map((p) => {
                    const Icon = p.icon;
                    return (
                      <TabsTrigger key={p.value} value={p.value}>
                        <Icon className="h-4 w-4 mr-2" />
                        {p.label}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </Tabs>
            </div>

            {/* Period Filter - Select for Mobile */}
            <div className="md:hidden">
              <Select value={period} onValueChange={onPeriodChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите период" />
                </SelectTrigger>
                <SelectContent>
                  {periods.map((p) => {
                    const Icon = p.icon;
                    return (
                      <SelectItem key={p.value} value={p.value}>
                        <div className="flex items-center">
                          <Icon className="h-4 w-4 mr-2" />
                          {p.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">Категория</label>
            <Select value={category} onValueChange={onCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите категорию" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => {
                  const Icon = c.icon;
                  return (
                    <SelectItem key={c.value} value={c.value}>
                      <div className="flex items-center">
                        <Icon className="h-4 w-4 mr-2" />
                        {c.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
