import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AddUserModalProps {
  onAddUser: (user: { name: string; role: string }) => void;
}

export default function AddUserModal({ onAddUser }: AddUserModalProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("Nurse");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert("Vui lòng nhập tên");
    onAddUser({ name, role });
    setName("");
    setRole("Nurse");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Thêm người dùng mới</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm người dùng mới</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-1">
              Tên người dùng
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên..."
            />
          </div>
          <div>
            <label htmlFor="role" className="block mb-1">
              Vai trò
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-md border border-input px-3 py-2 text-base"
            >
              <option value="Nurse">Nurse</option>
              <option value="Blood Store Supervisor">Blood Store Supervisor</option>
            </select>
          </div>
          <DialogFooter>
            <Button type="submit">Thêm</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
