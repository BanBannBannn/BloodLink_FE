import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EditAccountModalProps {
  user: {
    id: number;
    name: string;
    role: string;
  };
  onSave: (updatedUser: { id: number; name: string; role: string }) => void;
}

export default function EditAccountModal({ user, onSave }: EditAccountModalProps) {
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState(user.role);

  useEffect(() => {
    setName(user.name);
    setRole(user.role);
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert("Vui lòng nhập tên");
    onSave({ id: user.id, name, role });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-2">Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor={`name-${user.id}`} className="block mb-1">
              Tên người dùng
            </label>
            <Input
              id={`name-${user.id}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên..."
            />
          </div>
          <div>
            <label htmlFor={`role-${user.id}`} className="block mb-1">
              Vai trò
            </label>
            <select
              id={`role-${user.id}`}
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-md border border-input px-3 py-2 text-base"
            >
              <option value="Nurse">Nurse</option>
              <option value="Blood Store Supervisor">Blood Store Supervisor</option>
            </select>
          </div>
          <DialogFooter>
            <Button type="submit">Lưu thay đổi</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
