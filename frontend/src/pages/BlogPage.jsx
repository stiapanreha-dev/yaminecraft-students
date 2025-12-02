import { useState, useEffect, useMemo } from 'react';
import { Row, Col, Card, Badge, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Calendar, User, Filter, Bot } from 'lucide-react';
import { formatDateLong, formatRelativeDate } from '@/utils/dateFormatter';
import { articlesApi, projectsApi } from '@/services/api';
import { toast } from 'react-toastify';

// Определяет, нужен ли тёмный текст на данном фоне
const isLightColor = (hexColor) => {
  if (!hexColor) return true;
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  // Формула яркости (perceived luminance)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
};

export const BlogPage = () => {
  const [articles, setArticles] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [articlesRes, projectsRes] = await Promise.all([
        articlesApi.getAll({ published: true }),
        projectsApi.getAll()
      ]);
      setArticles(articlesRes.data);
      setProjects(projectsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Ошибка загрузки статей');
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = useMemo(() => {
    if (!selectedProject) return articles;
    return articles.filter(a => a.projectId === selectedProject);
  }, [articles, selectedProject]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-4 py-4">
      {/* Header */}
      <div>
        <h1 className="display-6 fw-bold mb-2">Блог проектов</h1>
        <p className="text-secondary">
          Статьи о наших проектах и достижениях в робототехнике
        </p>
      </div>

      {/* Project Filters */}
      {projects.length > 0 && (
        <div className="d-flex flex-wrap gap-2">
          <Button
            variant={selectedProject === null ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedProject(null)}
          >
            Все проекты
          </Button>
          {projects.map((project) => (
            <Button
              key={project.id}
              variant={selectedProject === project.id ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedProject(project.id)}
              style={selectedProject === project.id ? { backgroundColor: project.color, borderColor: project.color } : {}}
            >
              <span
                className="d-inline-block rounded-circle me-2"
                style={{ width: '8px', height: '8px', backgroundColor: project.color }}
              />
              {project.name}
            </Button>
          ))}
        </div>
      )}

      {/* Articles */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-5">
          <BookOpen size={48} className="text-secondary mb-3 mx-auto d-block" style={{ opacity: 0.5 }} />
          <p className="h5 text-secondary mb-2">Пока нет статей</p>
          <p className="text-secondary small">Скоро здесь появятся интересные материалы</p>
        </div>
      ) : (
        <Row className="g-4">
          {filteredArticles.map((article) => {
            const project = projects.find(p => p.id === article.projectId);
            const bgColor = project?.color || '#fff';
            const lightBg = isLightColor(bgColor);
            const textColor = lightBg ? '#212529' : '#fff';
            const textColorMuted = lightBg ? '#6c757d' : 'rgba(255,255,255,0.8)';
            const textColorMeta = lightBg ? '#6c757d' : 'rgba(255,255,255,0.7)';

            return (
              <Col key={article.id} xs={12} md={6} lg={4}>
                <Card
                  className="h-100 shadow-sm overflow-hidden"
                  as={Link}
                  to={`/blog/${article.slug}`}
                  style={{
                    textDecoration: 'none',
                    backgroundColor: bgColor
                  }}
                >
                  {/* Image */}
                  <div style={{ height: '180px' }}>
                    {article.imageUrl ? (
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-100 h-100 object-fit-cover"
                      />
                    ) : (
                      <div className="w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: lightBg ? '#f8f9fa' : 'rgba(255,255,255,0.2)' }}>
                        <Bot size={64} style={{ opacity: 0.3, color: textColorMuted }} />
                      </div>
                    )}
                  </div>

                  <Card.Body className="d-flex flex-column">
                    {/* Title */}
                    <h5 className="fw-bold mb-2" style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      color: textColor
                    }}>
                      {article.title}
                    </h5>

                    {/* Excerpt */}
                    <p className="small mb-3" style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      color: textColorMuted
                    }}>
                      {article.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="d-flex align-items-center gap-3 mt-auto small" style={{ color: textColorMeta }}>
                      <div className="d-flex align-items-center">
                        <Calendar size={14} className="me-1" />
                        {formatRelativeDate(article.publishedAt || article.createdAt)}
                      </div>
                      {article.author && (
                        <div className="d-flex align-items-center">
                          <User size={14} className="me-1" />
                          {article.author.firstName}
                        </div>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </div>
  );
};
