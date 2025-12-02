import { Card, Nav, Form } from 'react-bootstrap';
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
      <Card.Body>
        <div className="d-flex flex-column gap-4">
          {/* Period Filter */}
          <div>
            <Form.Label className="small fw-medium mb-2">Период</Form.Label>

            {/* Desktop - Nav tabs */}
            <div className="d-none d-md-block">
              <Nav variant="pills" className="nav-fill">
                {periods.map((p) => {
                  const Icon = p.icon;
                  return (
                    <Nav.Item key={p.value}>
                      <Nav.Link
                        active={period === p.value}
                        onClick={() => onPeriodChange(p.value)}
                        className="d-flex align-items-center justify-content-center gap-2"
                      >
                        <Icon style={{ width: '16px', height: '16px' }} />
                        {p.label}
                      </Nav.Link>
                    </Nav.Item>
                  );
                })}
              </Nav>
            </div>

            {/* Mobile - Select */}
            <div className="d-md-none">
              <Form.Select
                value={period}
                onChange={(e) => onPeriodChange(e.target.value)}
              >
                {periods.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </Form.Select>
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <Form.Label className="small fw-medium mb-2">Категория</Form.Label>
            <Form.Select
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </Form.Select>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};
