'use client';

import React, { useState } from 'react';
import Header from '@/components/header';
import Toast from '@/components/toast_notification';
import ConfirmModal from '@/components/confirm_modal';
import { TableSkeleton } from '@/components/skeleton_loader';
import { useToast } from '@/hooks/useToast';
import { useAdminUsers } from './hooks/useAdminUsers';
import type { AdminUser, AdminUserRole, CreateAdminUserPayload, UpdateAdminUserPayload } from './types';

const emptyCreateForm: CreateAdminUserPayload = {
  email: '',
  fullName: '',
  password: '',
  role: 'STUDENT',
};

const formatDate = (value: string | null) => {
  if (!value) return 'Unknown';
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(value));
};

export default function AdminUsersPage() {
  const {
    users,
    includeInactive,
    setIncludeInactive,
    searchTerm,
    setSearchTerm,
    isLoading,
    error,
    activeCount,
    inactiveCount,
    adminCount,
    handleAddUser,
    handleUpdateUser,
    handleDeleteUser,
    handleReactivateUser,
  } = useAdminUsers();
  const { toastConfig, showToast, hideToast } = useToast();
  const [createForm, setCreateForm] = useState<CreateAdminUserPayload>(emptyCreateForm);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<UpdateAdminUserPayload>({});
  const [userToDeactivate, setUserToDeactivate] = useState<AdminUser | null>(null);
  const [userToReactivate, setUserToReactivate] = useState<AdminUser | null>(null);

  const startEdit = (user: AdminUser) => {
    setEditingUserId(user.id);
    setEditForm({
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      isActive: user.isActive,
    });
  };

  const cancelEdit = () => {
    setEditingUserId(null);
    setEditForm({});
  };

  const submitCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    const success = await handleAddUser(createForm);
    if (success) {
      setCreateForm(emptyCreateForm);
      showToast('User created', `${createForm.fullName} can now sign in.`, 'success');
    } else {
      showToast('Create failed', 'Could not create this user.', 'error');
    }
  };

  const submitEdit = async (id: string) => {
    const success = await handleUpdateUser(id, editForm);
    if (success) {
      cancelEdit();
      showToast('User updated', 'User details were saved.', 'success');
    } else {
      showToast('Update failed', 'Could not update this user.', 'error');
    }
  };

  const deactivateUser = async () => {
    if (!userToDeactivate) return;

    const success = await handleDeleteUser(userToDeactivate.id);
    if (success) {
      showToast('User deactivated', `${userToDeactivate.fullName} was soft deleted.`, 'info');
      setUserToDeactivate(null);
    }
  };

  const reactivateUser = async () => {
    if (!userToReactivate) return;

    const success = await handleReactivateUser(userToReactivate.id);
    if (success) {
      showToast('User reactivated', `${userToReactivate.fullName} can log in again.`, 'success');
      setUserToReactivate(null);
    }
  };

  const updateCreateField = (field: keyof CreateAdminUserPayload, value: string) => {
    setCreateForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateEditField = (field: keyof UpdateAdminUserPayload, value: string | boolean) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-[#f4f0e8] font-body text-on-surface min-h-screen">
      <Header role="admin" />
      <main className="app-shell-main app-shell-content page-shell px-6 md:px-8 xl:px-10 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-10">
          <div>
            <h1 className="font-headline font-extrabold text-4xl tracking-tight">User Management</h1>
            <p className="text-on-surface-variant mt-3 text-lg font-medium max-w-2xl">
              Create staff or student accounts, update roles, and soft delete inactive users without removing history.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 min-w-full sm:min-w-[420px]">
            <div className="bg-white rounded-2xl border border-outline-variant p-4 shadow-sm">
              <div className="text-2xl font-extrabold text-primary">{activeCount}</div>
              <div className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">Active</div>
            </div>
            <div className="bg-white rounded-2xl border border-outline-variant p-4 shadow-sm">
              <div className="text-2xl font-extrabold text-on-error-container">{inactiveCount}</div>
              <div className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">Inactive</div>
            </div>
            <div className="bg-white rounded-2xl border border-outline-variant p-4 shadow-sm">
              <div className="text-2xl font-extrabold text-primary">{adminCount}</div>
              <div className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">Admins</div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-error-container bg-error-container p-4 text-on-error-container font-semibold">
            {error}
          </div>
        )}

        <section className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-8">
          <form onSubmit={submitCreate} className="bg-white border border-outline-variant rounded-2xl p-6 shadow-sm h-fit space-y-4">
            <div>
              <h2 className="font-headline text-2xl font-extrabold">Create User</h2>
              <p className="text-on-surface-variant text-sm font-medium mt-1">New accounts are active by default.</p>
            </div>
            <input className="w-full rounded-xl border-outline-variant px-4 py-3" placeholder="Full name" value={createForm.fullName} onChange={(e) => updateCreateField('fullName', e.target.value)} required />
            <input className="w-full rounded-xl border-outline-variant px-4 py-3" placeholder="Email" type="email" value={createForm.email} onChange={(e) => updateCreateField('email', e.target.value)} required />
            <input className="w-full rounded-xl border-outline-variant px-4 py-3" placeholder="Password" type="password" value={createForm.password} onChange={(e) => updateCreateField('password', e.target.value)} required minLength={6} />
            <select className="w-full rounded-xl border-outline-variant px-4 py-3" value={createForm.role} onChange={(e) => updateCreateField('role', e.target.value as AdminUserRole)}>
              <option value="STUDENT">Student</option>
              <option value="ADMIN">Admin</option>
            </select>
            <button className="bg-primary text-on-primary px-6 py-3 rounded-xl font-bold w-full shadow-md shadow-primary/20 hover:bg-[#274c42] transition-all">
              Create User
            </button>
          </form>

          <section className="space-y-5">
            <div className="bg-white border border-outline-variant rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
              <input className="w-full md:max-w-md rounded-xl border-outline-variant px-4 py-3" placeholder="Search name, email, or role" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <label className="flex items-center gap-3 text-sm font-bold text-on-surface-variant">
                <input type="checkbox" checked={includeInactive} onChange={(e) => setIncludeInactive(e.target.checked)} className="h-5 w-5" />
                Include inactive users
              </label>
            </div>

            <div className="bg-white border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
              {isLoading ? (
                <TableSkeleton rows={6} />
              ) : users.length === 0 ? (
                <div className="p-12 text-center font-semibold text-on-surface-variant">No users found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[900px]">
                    <thead className="bg-surface-variant/30 border-b border-outline-variant/50">
                      <tr>
                        <th className="px-6 py-4 text-xs uppercase tracking-widest text-on-surface-variant">User</th>
                        <th className="px-6 py-4 text-xs uppercase tracking-widest text-on-surface-variant">Role</th>
                        <th className="px-6 py-4 text-xs uppercase tracking-widest text-on-surface-variant">Status</th>
                        <th className="px-6 py-4 text-xs uppercase tracking-widest text-on-surface-variant">Created</th>
                        <th className="px-6 py-4 text-right text-xs uppercase tracking-widest text-on-surface-variant">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/50">
                      {users.map((user) => {
                        const isEditing = editingUserId === user.id;
                        return (
                          <tr key={user.id} className={!user.isActive ? 'bg-surface-variant/20' : ''}>
                            <td className="px-6 py-4">
                              {isEditing ? (
                                <div className="space-y-2">
                                  <input className="w-full rounded-lg border-outline-variant px-3 py-2" value={editForm.fullName || ''} onChange={(e) => updateEditField('fullName', e.target.value)} />
                                  <input className="w-full rounded-lg border-outline-variant px-3 py-2" type="email" value={editForm.email || ''} onChange={(e) => updateEditField('email', e.target.value)} />
                                </div>
                              ) : (
                                <div className="flex items-center gap-3">
                                  <div className="h-11 w-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-extrabold overflow-hidden">
                                    {user.avatarUrl ? <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" /> : user.fullName.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <div className="font-extrabold">{user.fullName}</div>
                                    <div className="text-sm text-on-surface-variant">{user.email}</div>
                                  </div>
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              {isEditing ? (
                                <select className="rounded-lg border-outline-variant px-3 py-2" value={editForm.role || 'STUDENT'} onChange={(e) => updateEditField('role', e.target.value as AdminUserRole)}>
                                  <option value="STUDENT">Student</option>
                                  <option value="ADMIN">Admin</option>
                                </select>
                              ) : (
                                <span className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-extrabold">{user.role}</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              {isEditing ? (
                                <label className="flex items-center gap-2 font-bold text-sm">
                                  <input type="checkbox" checked={Boolean(editForm.isActive)} onChange={(e) => updateEditField('isActive', e.target.checked)} />
                                  Active
                                </label>
                              ) : (
                                <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${user.isActive ? 'bg-primary-container text-on-primary-container' : 'bg-error-container text-on-error-container'}`}>
                                  {user.isActive ? 'ACTIVE' : 'INACTIVE'}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-sm text-on-surface-variant font-semibold">{formatDate(user.createdAt)}</td>
                            <td className="px-6 py-4 text-right space-x-2">
                              {isEditing ? (
                                <>
                                  <button onClick={() => submitEdit(user.id)} className="px-4 py-2 rounded-lg bg-primary/10 text-primary font-bold">Save</button>
                                  <button onClick={cancelEdit} className="px-4 py-2 rounded-lg bg-surface-variant text-on-surface-variant font-bold">Cancel</button>
                                </>
                              ) : (
                                <>
                                  <button onClick={() => startEdit(user)} className="px-4 py-2 rounded-lg bg-primary/10 text-primary font-bold">Edit</button>
                                  {user.isActive ? (
                                    <button onClick={() => setUserToDeactivate(user)} className="px-4 py-2 rounded-lg bg-error/10 text-error font-bold">Deactivate</button>
                                  ) : (
                                    <button onClick={() => setUserToReactivate(user)} className="px-4 py-2 rounded-lg bg-primary-container text-on-primary-container font-bold">Reactivate</button>
                                  )}
                                </>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        </section>
      </main>
      <Toast isVisible={toastConfig.isVisible} type={toastConfig.type} title={toastConfig.title} description={toastConfig.description} onClose={hideToast} />
      <ConfirmModal
        isOpen={Boolean(userToDeactivate)}
        title="Deactivate user?"
        description={userToDeactivate ? `${userToDeactivate.fullName} will no longer be able to log in. History is preserved.` : ''}
        confirmLabel="Deactivate"
        variant="danger"
        onCancel={() => setUserToDeactivate(null)}
        onConfirm={() => void deactivateUser()}
      />
      <ConfirmModal
        isOpen={Boolean(userToReactivate)}
        title="Reactivate user?"
        description={userToReactivate ? `${userToReactivate.fullName} will be able to log in again.` : ''}
        confirmLabel="Reactivate"
        onCancel={() => setUserToReactivate(null)}
        onConfirm={() => void reactivateUser()}
      />
    </div>
  );
}
