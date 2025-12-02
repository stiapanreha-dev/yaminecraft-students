import { useState } from 'react';
import { Table, Form, Dropdown } from 'react-bootstrap';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Shield, User, Search, Eye, GraduationCap, Clock } from 'lucide-react';

const roleConfig = {
  VISITOR: { label: 'Посетитель', icon: Eye, variant: 'outline' },
  STUDENT: { label: 'Ученик', icon: User, variant: 'secondary' },
  PENDING_TEACHER: { label: 'Ожидает', icon: Clock, variant: 'warning' },
  TEACHER: { label: 'Педагог', icon: GraduationCap, variant: 'success' },
  ADMIN: { label: 'Админ', icon: Shield, variant: 'destructive' },
};

/**
 * Компонент управления пользователями для админа
 * @param {Array} users - список пользователей
 * @param {Function} onChangeRole - callback для изменения роли
 * @param {Function} onViewProfile - callback для просмотра профиля
 */
export const UserManager = ({ users = [], onChangeRole, onViewProfile }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName || ''} ${user.lastName || ''} ${user.email}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  const handleRoleChange = async (userId, newRole) => {
    if (onChangeRole) {
      await onChangeRole(userId, newRole);
    }
  };

  return (
    <div className="d-flex flex-column gap-3">
      {/* Search */}
      <div className="position-relative">
        <Search
          className="position-absolute text-secondary"
          style={{
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '16px',
            height: '16px'
          }}
        />
        <Form.Control
          type="text"
          placeholder="Поиск пользователей..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ paddingLeft: '40px' }}
        />
      </div>

      {/* Table */}
      <div className="border rounded">
        <Table hover responsive className="mb-0">
          <thead className="bg-light">
            <tr>
              <th>Пользователь</th>
              <th>Email</th>
              <th className="d-none d-md-table-cell">Класс</th>
              <th>Роль</th>
              <th style={{ width: '70px' }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => {
                const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Без имени';
                const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || '?';

                return (
                  <tr key={user.id}>
                    <td className="align-middle">
                      <div className="d-flex align-items-center gap-2">
                        <Avatar size="sm">
                          <AvatarImage src={user.photoUrl} alt={fullName} />
                          <AvatarFallback />
                        </Avatar>
                        <span className="fw-medium">{fullName}</span>
                      </div>
                    </td>

                    <td className="align-middle text-secondary small">
                      {user.email}
                    </td>

                    <td className="align-middle d-none d-md-table-cell">
                      <Badge variant="outline">{user.class || '-'}</Badge>
                    </td>

                    <td className="align-middle">
                      {(() => {
                        const config = roleConfig[user.role] || roleConfig.VISITOR;
                        const RoleIcon = config.icon;
                        return (
                          <Badge variant={config.variant}>
                            <span className="d-flex align-items-center gap-1">
                              <RoleIcon style={{ width: '12px', height: '12px' }} />
                              {config.label}
                            </span>
                          </Badge>
                        );
                      })()}
                    </td>

                    <td className="align-middle">
                      <Dropdown align="end">
                        <Dropdown.Toggle
                          as={Button}
                          variant="ghost"
                          size="icon"
                          className="border-0"
                        >
                          <MoreHorizontal style={{ width: '16px', height: '16px' }} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="shadow-sm">
                          <Dropdown.Header>Действия</Dropdown.Header>
                          <Dropdown.Item onClick={() => onViewProfile?.(user.id)}>
                            Просмотр профиля
                          </Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Header>Изменить роль</Dropdown.Header>
                          {Object.entries(roleConfig).map(([role, config]) => {
                            const RoleIcon = config.icon;
                            return (
                              <Dropdown.Item
                                key={role}
                                onClick={() => handleRoleChange(user.id, role)}
                                disabled={user.role === role}
                                className={user.role === role ? 'bg-light' : ''}
                              >
                                <RoleIcon style={{ width: '16px', height: '16px' }} className="me-2" />
                                {config.label}
                              </Dropdown.Item>
                            );
                          })}
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4 text-secondary">
                  Пользователи не найдены
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};
