import { useState, useEffect } from 'react';
import { Row, Col, Card, Badge, Spinner, Modal } from 'react-bootstrap';
import { Button } from '@/components/ui/button';
import { FileText, Download, Eye, FolderOpen, File, FileImage, FileType, Bot, Plus, Pencil, Trash2, Files } from 'lucide-react';
import { materialsApi } from '@/services/api';
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks/useAuth';
import { MaterialForm } from '@/components/admin/MaterialForm';

const categoryConfig = {
  METHODOLOGY: { label: 'Методические материалы', color: 'primary' },
  LESSON_PLAN: { label: 'Планы уроков', color: 'success' },
  PRESENTATION: { label: 'Презентации', color: 'warning' },
  WORKSHEET: { label: 'Рабочие листы', color: 'info' },
  OTHER: { label: 'Другое', color: 'secondary' },
};

const getFileIcon = (fileType) => {
  if (!fileType) return File;
  if (fileType.includes('pdf')) return FileType;
  if (fileType.includes('image')) return FileImage;
  if (fileType.includes('presentation') || fileType.includes('pptx')) return FileText;
  return File;
};

const formatFileSize = (bytes) => {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const MaterialsPage = () => {
  const { user } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const canManage = user?.role === 'ADMIN' || user?.role === 'TEACHER';

  useEffect(() => {
    fetchMaterials();
  }, [selectedCategory]);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const response = await materialsApi.getAll(selectedCategory);
      setMaterials(response.data);
    } catch (error) {
      console.error('Error fetching materials:', error);
      toast.error('Ошибка загрузки материалов');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (material, fileUrl = null) => {
    try {
      setDownloading(material.id);
      await materialsApi.download(material.id);
      // Если передан конкретный файл, открываем его, иначе первый файл из массива
      const url = fileUrl || material.files?.[0]?.fileUrl;
      if (url) {
        window.open(url, '_blank');
        toast.success('Скачивание начато');
      } else {
        toast.warning('Файл не найден');
      }
      await fetchMaterials();
    } catch (error) {
      console.error('Error downloading:', error);
      toast.error('Ошибка скачивания');
    } finally {
      setDownloading(null);
    }
  };

  const getTotalFilesSize = (files) => {
    if (!files || files.length === 0) return 0;
    return files.reduce((sum, file) => sum + (file.fileSize || 0), 0);
  };

  const handleCreateMaterial = async (data) => {
    try {
      setSubmitLoading(true);
      if (editingMaterial) {
        await materialsApi.update(editingMaterial.id, data);
        toast.success('Материал обновлен');
      } else {
        await materialsApi.create(data);
        toast.success('Материал создан');
      }
      setShowForm(false);
      setEditingMaterial(null);
      fetchMaterials();
    } catch (error) {
      console.error('Error saving material:', error);
      toast.error(editingMaterial ? 'Ошибка обновления' : 'Ошибка создания');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEditMaterial = (material) => {
    // Подготовить данные для формы
    const formData = {
      title: material.title,
      description: material.description,
      imageUrl: material.imageUrl || '',
      category: material.category,
      files: material.files?.map(f => ({
        filename: f.filename,
        fileUrl: f.fileUrl,
        fileSize: f.fileSize,
        fileType: f.fileType,
      })) || [],
    };
    setEditingMaterial({ ...material, ...formData });
    setShowForm(true);
  };

  const handleDeleteMaterial = async (id) => {
    if (!confirm('Удалить материал?')) return;
    try {
      await materialsApi.delete(id);
      toast.success('Материал удален');
      fetchMaterials();
    } catch (error) {
      console.error('Error deleting material:', error);
      toast.error('Ошибка удаления');
    }
  };

  const categories = Object.entries(categoryConfig);

  return (
    <div className="d-flex flex-column gap-4 py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <h1 className="display-6 fw-bold mb-2">Материалы для педагогов</h1>
          <p className="text-secondary">
            Методические материалы, планы уроков и презентации по робототехнике
          </p>
        </div>
        {canManage && (
          <Button onClick={() => { setEditingMaterial(null); setShowForm(true); }}>
            <Plus size={16} className="me-2" />
            Добавить материал
          </Button>
        )}
      </div>

      {/* Category Filters */}
      <div className="d-flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === null ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory(null)}
        >
          <FolderOpen size={16} className="me-2" />
          Все материалы
        </Button>
        {categories.map(([key, config]) => (
          <Button
            key={key}
            variant={selectedCategory === key ? config.color : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(key)}
          >
            {config.label}
          </Button>
        ))}
      </div>

      {/* Materials */}
      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : materials.length === 0 ? (
        <div className="text-center py-5">
          <FileText size={48} className="text-secondary mb-3 mx-auto d-block" style={{ opacity: 0.5 }} />
          <p className="h5 text-secondary mb-2">Нет материалов</p>
          <p className="text-secondary small">
            {selectedCategory ? 'В этой категории пока нет материалов' : 'Скоро здесь появятся полезные материалы'}
          </p>
        </div>
      ) : (
        <Row className="g-4">
          {materials.map((material) => {
            const category = categoryConfig[material.category] || categoryConfig.OTHER;
            const filesCount = material.files?.length || 0;
            const totalSize = getTotalFilesSize(material.files);

            return (
              <Col key={material.id} xs={12} sm={6} lg={4}>
                <Card
                  className="h-100 overflow-hidden border-0"
                  style={{
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    backgroundColor: 'var(--bs-primary)',
                    color: 'white'
                  }}
                  onClick={() => setSelectedMaterial(material)}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '';
                  }}
                >
                  {/* Image */}
                  <div className="position-relative" style={{ height: '180px' }}>
                    {material.imageUrl ? (
                      <img
                        src={material.imageUrl}
                        alt={material.title}
                        className="w-100 h-100 object-fit-cover"
                      />
                    ) : (
                      <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-light">
                        <Bot size={64} className="text-secondary opacity-50" />
                      </div>
                    )}
                  </div>

                  <Card.Body className="d-flex flex-column p-3">
                    {/* Category badge */}
                    <div className="mb-2">
                      <Badge bg={category.color} className="d-inline-flex align-items-center gap-1">
                        <FileText size={14} />
                        {category.label}
                      </Badge>
                    </div>

                    {/* Title */}
                    <h5 className="fw-bold mb-2 text-white" style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {material.title}
                    </h5>

                    {/* Description */}
                    <p className="small mb-3" style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      opacity: 0.9
                    }}>
                      {material.description}
                    </p>

                    {/* File info */}
                    <div className="d-flex flex-column gap-2 mb-3 mt-auto">
                      <div className="d-flex align-items-center small" style={{ opacity: 0.9 }}>
                        <Files size={16} className="me-2 flex-shrink-0 text-white" />
                        <span>
                          {filesCount} {filesCount === 1 ? 'файл' : filesCount < 5 ? 'файла' : 'файлов'}
                          {totalSize > 0 && ` (${formatFileSize(totalSize)})`}
                        </span>
                      </div>
                      <div className="d-flex align-items-center small" style={{ opacity: 0.9 }}>
                        <Download size={16} className="me-2 flex-shrink-0 text-white" />
                        <span>{material.downloads || 0} скачиваний</span>
                      </div>
                    </div>

                    {/* Author */}
                    {material.createdBy && (
                      <p className="small mb-3" style={{ opacity: 0.8 }}>
                        Автор: <span className="fw-medium">{material.createdBy.firstName} {material.createdBy.lastName}</span>
                      </p>
                    )}

                    {/* Actions */}
                    <div className="d-flex gap-2">
                      <Button
                        variant="accent"
                        className="flex-grow-1"
                        disabled={downloading === material.id || filesCount === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(material);
                        }}
                      >
                        <Download size={16} className="me-1" />
                        Скачать
                      </Button>
                      {canManage && (
                        <>
                          <Button
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditMaterial(material);
                            }}
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteMaterial(material.id);
                            }}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      {/* Detail Modal */}
      <Modal show={!!selectedMaterial} onHide={() => setSelectedMaterial(null)} size="lg" centered>
        {selectedMaterial && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{selectedMaterial.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {/* Image */}
              {selectedMaterial.imageUrl ? (
                <div className="rounded overflow-hidden mb-4" style={{ height: '250px' }}>
                  <img
                    src={selectedMaterial.imageUrl}
                    alt={selectedMaterial.title}
                    className="w-100 h-100 object-fit-cover"
                  />
                </div>
              ) : (
                <div className="rounded bg-light d-flex align-items-center justify-content-center mb-4" style={{ height: '200px' }}>
                  <Bot size={64} className="text-secondary" style={{ opacity: 0.3 }} />
                </div>
              )}

              {/* Category */}
              <Badge bg={categoryConfig[selectedMaterial.category]?.color || 'secondary'} className="mb-3">
                {categoryConfig[selectedMaterial.category]?.label || 'Другое'}
              </Badge>

              {/* Description */}
              <p className="text-secondary mb-4" style={{ whiteSpace: 'pre-wrap' }}>
                {selectedMaterial.description}
              </p>

              {/* Stats */}
              <div className="d-flex flex-wrap gap-4 mb-4 text-muted">
                <div>
                  <small className="d-block text-muted">Файлов</small>
                  <span className="fw-medium">{selectedMaterial.files?.length || 0}</span>
                </div>
                <div>
                  <small className="d-block text-muted">Общий размер</small>
                  <span className="fw-medium">{formatFileSize(getTotalFilesSize(selectedMaterial.files))}</span>
                </div>
                <div>
                  <small className="d-block text-muted">Скачиваний</small>
                  <span className="fw-medium">{selectedMaterial.downloads || 0}</span>
                </div>
              </div>

              {/* Files list */}
              {selectedMaterial.files && selectedMaterial.files.length > 0 && (
                <div className="mb-4">
                  <h6 className="fw-bold mb-3">Файлы для скачивания:</h6>
                  <div className="d-flex flex-column gap-2">
                    {selectedMaterial.files.map((file, index) => {
                      const FileIcon = getFileIcon(file.fileType);
                      return (
                        <div
                          key={file.id || index}
                          className="d-flex align-items-center justify-content-between p-3 border rounded bg-light"
                        >
                          <div className="d-flex align-items-center flex-grow-1 overflow-hidden me-3">
                            <FileIcon className="text-secondary me-2 flex-shrink-0" size={20} />
                            <div className="overflow-hidden">
                              <div className="text-truncate fw-medium">{file.filename}</div>
                              <div className="text-muted small">
                                {formatFileSize(file.fileSize)} • {file.fileType}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="accent"
                            size="sm"
                            onClick={() => {
                              window.open(file.fileUrl, '_blank');
                              materialsApi.download(selectedMaterial.id);
                            }}
                          >
                            <Download size={16} className="me-1" />
                            Скачать
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Download all button */}
              {selectedMaterial.files && selectedMaterial.files.length > 1 && (
                <Button
                  variant="outline"
                  className="w-100"
                  disabled={downloading === selectedMaterial.id}
                  onClick={() => {
                    selectedMaterial.files.forEach((file) => {
                      window.open(file.fileUrl, '_blank');
                    });
                    materialsApi.download(selectedMaterial.id);
                  }}
                >
                  <Download size={18} className="me-2" />
                  Скачать все файлы ({selectedMaterial.files.length})
                </Button>
              )}
            </Modal.Body>
          </>
        )}
      </Modal>

      {/* Create/Edit Material Modal */}
      <Modal
        show={showForm}
        onHide={() => { setShowForm(false); setEditingMaterial(null); }}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{editingMaterial ? 'Редактировать материал' : 'Добавить материал'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <MaterialForm
            initialData={editingMaterial}
            onSubmit={handleCreateMaterial}
            onCancel={() => { setShowForm(false); setEditingMaterial(null); }}
            loading={submitLoading}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};
