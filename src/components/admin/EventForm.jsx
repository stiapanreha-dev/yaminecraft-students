import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventSchema } from '@/utils/validators';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImageUpload } from '@/components/ui/image-upload';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

/**
 * Форма создания/редактирования мероприятия
 * @param {Object} initialData - начальные данные для редактирования
 * @param {Function} onSubmit - callback для отправки формы
 * @param {Function} onCancel - callback для отмены
 * @param {boolean} loading - состояние загрузки
 */
export const EventForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const form = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: initialData || {
      title: '',
      description: '',
      date: new Date(),
      location: '',
      imageUrl: ''
    }
  });

  const handleSubmit = async (data) => {
    if (onSubmit) {
      await onSubmit(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название мероприятия</FormLabel>
              <FormControl>
                <Input placeholder="Спортивные соревнования" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Описание</FormLabel>
              <FormControl>
                <textarea
                  placeholder="Подробное описание мероприятия..."
                  className="w-full min-h-[150px] px-3 py-2 text-sm border rounded-md"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date and Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Дата мероприятия</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP', { locale: ru })
                        ) : (
                          <span>Выберите дату</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date('1900-01-01')}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Место проведения</FormLabel>
                <FormControl>
                  <Input placeholder="Спортивный зал №1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Image Upload */}
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Изображение мероприятия (опционально)</FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value}
                  onChange={field.onChange}
                  onRemove={() => field.onChange('')}
                  disabled={loading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Отмена
            </Button>
          )}
          <Button type="submit" disabled={loading}>
            {loading ? 'Сохранение...' : initialData ? 'Обновить' : 'Создать'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
