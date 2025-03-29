'use client';

import { useEffect, useState } from 'react';
import { Role } from '@prisma/client';
import  Button  from '@/components/ui/button';
import  Dialog, {DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import ReturnHomeButton from '../components/ReturnHome';

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

interface Activity {
  id: string;
  userId: string;
  action: string;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<{ id: string; role: Role } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      });

    fetch('/api/activities')
      .then((res) => res.json())
      .then(setActivities);
  }, []);

  const handleRoleChange = (userId: string, role: Role) => {
    setSelectedUser({ id: userId, role });
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  const confirmRoleUpdate = async () => {
    if (!selectedUser) return;

    const res = await fetch('/api/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: selectedUser.id, role: selectedRole }),
    });

    if (res.ok) {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUser.id ? { ...user, role: selectedRole! } : user
        )
      );
      setIsModalOpen(false);
      setSelectedUser(null);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const todaysActivities = activities.filter((activity) => activity.createdAt.startsWith(today));

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">User Management</h1>
      <ReturnHomeButton />
      <div className="overflow-x-auto p-4">
        <table className="w-full border rounded-lg shadow-md">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Joined</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t hover:bg-gray-100">
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value as Role)}
                    className="border p-2 rounded"
                  >
                    {Object.values(Role).map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </td>
                <td className="p-3">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="p-3">
                  <Button onClick={() => handleRoleChange(user.id, user.role)} className="bg-blue-600 text-white px-3 py-1 rounded-lg">
                    Update
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogTitle>Confirm Role Change</DialogTitle>
            <DialogDescription>
              Are you sure you want to update this user's role to <strong>{selectedRole}</strong>?
            </DialogDescription>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={confirmRoleUpdate} className="bg-red-600 text-white">Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* User Activities */}
      <h2 className="text-2xl font-bold mt-8">Today's Activities</h2>
      <div className="bg-gray-100 p-4 rounded-lg mt-4 shadow">
        {todaysActivities.length === 0 ? (
          <p className="text-gray-500">No activities recorded today.</p>
        ) : (
          <ul className="list-disc list-inside">
            {todaysActivities.map((activity) => (
              <li key={activity.id} className="p-2 border-b">
                <span className="font-semibold">{activity.action}</span> on {new Date(activity.createdAt).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
