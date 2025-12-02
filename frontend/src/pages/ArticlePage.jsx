import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Badge, Spinner } from 'react-bootstrap';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User, Bot } from 'lucide-react';
import { formatDateLong } from '@/utils/dateFormatter';
import { articlesApi, projectsApi } from '@/services/api';
import { toast } from 'react-toastify';

export const ArticlePage = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticle();
  }, [slug]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await articlesApi.getByIdOrSlug(slug);
      setArticle(response.data);

      if (response.data.projectId) {
        const projectRes = await projectsApi.getById(response.data.projectId);
        setProject(projectRes.data);
      }
    } catch (error) {
      console.error('Error fetching article:', error);
      toast.error('Статья не найдена');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-5">
        <h1 className="display-1 fw-bold mb-3">404</h1>
        <p className="text-secondary mb-4">Статья не найдена</p>
        <Button as={Link} to="/blog" variant="primary">
          <ArrowLeft size={18} className="me-2" />
          Вернуться к блогу
        </Button>
      </div>
    );
  }

  return (
    <div className="py-4">
      {/* Back button */}
      <Button as={Link} to="/blog" variant="link" className="mb-4 p-0 text-secondary">
        <ArrowLeft size={18} className="me-2" />
        Назад к блогу
      </Button>

      {/* Article */}
      <article className="mx-auto" style={{ maxWidth: '800px' }}>
        {/* Project badge */}
        {project && (
          <Badge className="mb-3" style={{ backgroundColor: project.color }}>
            {project.name}
          </Badge>
        )}

        {/* Title */}
        <h1 className="display-5 fw-bold mb-3">{article.title}</h1>

        {/* Meta */}
        <div className="d-flex align-items-center gap-4 mb-4 text-muted">
          <div className="d-flex align-items-center">
            <Calendar size={18} className="me-2" />
            {formatDateLong(article.publishedAt || article.createdAt)}
          </div>
          {article.author && (
            <div className="d-flex align-items-center">
              <User size={18} className="me-2" />
              {article.author.firstName} {article.author.lastName}
            </div>
          )}
        </div>

        {/* Image */}
        {article.imageUrl ? (
          <div className="rounded overflow-hidden mb-4" style={{ maxHeight: '400px' }}>
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-100 object-fit-cover"
            />
          </div>
        ) : (
          <div className="rounded bg-light d-flex align-items-center justify-content-center mb-4" style={{ height: '300px' }}>
            <Bot size={80} className="text-secondary" style={{ opacity: 0.3 }} />
          </div>
        )}

        {/* Excerpt */}
        {article.excerpt && (
          <p className="lead text-secondary mb-4">{article.excerpt}</p>
        )}

        {/* Content */}
        <div className="article-content" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>
          {article.content}
        </div>
      </article>
    </div>
  );
};
