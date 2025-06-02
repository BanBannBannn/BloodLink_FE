import React, { useState } from "react";
import AddUserModal from "./AddUserModal";
import { Button } from "@/components/ui/button";
import EditAccountModal from "./EditAccountModal";

interface User {
  id: number;
  name: string;
  role: string;
  isActive: boolean;
}

const initialUsers: User[] = [
  { id: 1, name: "Nguyễn Văn A", role: "Nurse", isActive: true },
  { id: 2, name: "Trần Thị B", role: "Blood Store Supervisor", isActive: true },
];

export default function AccountManagement() {
  const [users, setUsers] = useState<User[]>(initialUsers);

  const toggleStatus = (id: number) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, isActive: !user.isActive } : user
      )
    );
  };

  const handleAddUser = (newUser: { name: string; role: string }) => {
    const newId = users.length + 1;
    setUsers((prev) => [
      ...prev,
      { id: newId, name: newUser.name, role: newUser.role, isActive: true },
    ]);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Quản lý tài khoản</h1>
      <div className="mb-4">
        <AddUserModal onAddUser={handleAddUser} />
      </div>
      <table className="w-full border">

        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">Tên</th>
            <th className="p-2">Vai trò</th>
            <th className="p-2">Trạng thái</th>
            <th className="p-2">Hành động</th>
          </tr>
        </thead>

        <tbody>

          {users.map((user) => (
            <tr key={user.id} className="border-t text-center">
              <td className="p-2">{user.id}</td>
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.role}</td>
              <td className="p-2">
                {user.isActive ? "Hoạt động" : "Vô hiệu hóa"}
              </td>
              
              <td className="p-2 flex justify-center gap-2">
                <Button
                  variant="outline"
                  className={`${
                    user.isActive
                      ? "text-red-500 hover:bg-red-100"
                      : "text-green-500 hover:bg-green-100"
                  }`}
                  onClick={() => toggleStatus(user.id)}
                >
                  {user.isActive ? "Disable" : "Enable"}
                </Button>

                <EditAccountModal
                  user={user}
                  onSave={(updatedUser) => {
                    setUsers((prev) =>
                      prev.map((u) =>
                        u.id === updatedUser.id
                          ? {
                              ...u,
                              name: updatedUser.name,
                              role: updatedUser.role,
                            }
                          : u
                      )
                    );
                  }}
                />
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
