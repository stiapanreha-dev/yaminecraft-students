import { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { Button } from '@/components/ui/button';
import { ImageUpload } from '@/components/ui/image-upload';

export const BannerForm = ({ initialData, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    imageUrl: '',
    backgroundColor: '#313642',
    buttonText: '',
    buttonLink: '',
    isActive: true,
    order: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        subtitle: initialData.subtitle || '',
        imageUrl: initialData.imageUrl || '',
        backgroundColor: initialData.backgroundColor || '#313642',
        buttonText: initialData.buttonText || '',
        buttonLink: initialData.buttonLink || '',
        isActive: initialData.isActive ?? true,
        order: initialData.order || 0,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (url) => {
    setFormData((prev) => ({ ...prev, imageUrl: url }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      order: parseInt(formData.order) || 0,
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Заголовок *</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Заголовок баннера"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Подзаголовок</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          name="subtitle"
          value={formData.subtitle}
          onChange={handleChange}
          placeholder="Дополнительный текст"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Изображение (опционально)</Form.Label>
        <ImageUpload
          value={formData.imageUrl}
          onChange={handleImageChange}
          placeholder="Загрузите фоновое изображение"
        />
        <Form.Text className="text-muted">
          Если изображение не задано, будет использован цвет фона
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Цвет фона</Form.Label>
        <div className="d-flex align-items-center gap-3">
          <Form.Control
            type="color"
            name="backgroundColor"
            value={formData.backgroundColor}
            onChange={handleChange}
            style={{ width: '60px', height: '40px', padding: '2px' }}
          />
          <Form.Control
            type="text"
            name="backgroundColor"
            value={formData.backgroundColor}
            onChange={handleChange}
            placeholder="#313642"
            style={{ width: '120px' }}
          />
        </div>
        <Form.Text className="text-muted">
          Используется, если изображение не задано
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Текст кнопки</Form.Label>
        <Form.Control
          type="text"
          name="buttonText"
          value={formData.buttonText}
          onChange={handleChange}
          placeholder="Например: Узнать больше"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Ссылка кнопки</Form.Label>
        <Form.Control
          type="text"
          name="buttonLink"
          value={formData.buttonLink}
          onChange={handleChange}
          placeholder="/events или https://..."
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Порядок отображения</Form.Label>
        <Form.Control
          type="number"
          name="order"
          value={formData.order}
          onChange={handleChange}
          min="0"
        />
        <Form.Text className="text-muted">
          Чем меньше число, тем выше баннер в списке
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Check
          type="checkbox"
          name="isActive"
          checked={formData.isActive}
          onChange={handleChange}
          label="Активен (показывать на сайте)"
        />
      </Form.Group>

      <div className="d-flex justify-content-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Отмена
        </Button>
        <Button type="submit" disabled={loading || !formData.title}>
          {loading ? 'Сохранение...' : initialData ? 'Сохранить' : 'Создать'}
        </Button>
      </div>
    </Form>
  );
};
