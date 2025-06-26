import { getAllAccount } from "@/api/adminApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  EllipsisVertical,
  LockKeyhole,
  Search,
  SquarePen,
  Trash2,
  UserPlus,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AddUserForm from "@/components/AddUserForm";

export interface User {
  addresss: string;
  backUrlIdentity: string;
  bloodGroupId: string;
  bloodGroupName: string;
  email: string;
  frontUrlIdentity: string;
  fullName: string;
  gender: boolean;
  id: string;
  identityId: string;
  phoneNo: string;
  roleId: string;
  roleName: string;
  status: string;
}

function StatusBadge({ status }: { status: string }) {
  const color =
    status === "Active"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
      : "bg-red-50 text-red-700 ring-red-600/20";
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${color}`}
    >
      {status === "Active" ? "● Mở" : "● Khóa"}
    </span>
  );
}

const ROLE_NURSE_ID = import.meta.env.VITE_ROLE_NURSE;

export default function NurseManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);

  const handleAddNurseSuccess = (newUser: User) => {
    setUsers((prev) => [...prev, newUser]);
    setFilteredUsers((prev) => {
      if (
        searchTerm === "" ||
        Object.values(newUser).some((value) =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      ) {
        return [...prev, newUser];
      }
      return prev;
    });
    setOpen(false);
  };

  useEffect(() => {
    const getAllUser = async () => {
      try {
        const response = await getAllAccount();
        const listNurse = response.data.records.filter(
          (user: User) => user.roleId === ROLE_NURSE_ID
        );
        setUsers(listNurse);
        setFilteredUsers(listNurse);
      } catch (error) {
        console.log(error);
      }
    };
    getAllUser();
  }, []);

  useEffect(() => {
    const filtered = users.filter((user) =>
      Object.values(user).some((value) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  return (
    <div className="p-6 h-full flex flex-col flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight uppercase">
          Quản lí ý tá
        </h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <Button asChild>
              <div className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Thêm y tá
              </div>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader className="!flex-row justify-between items-center">
              <DialogTitle>Thêm y tá mới</DialogTitle>
              <X className="cursor-pointer" onClick={() => setOpen(false)} />
            </DialogHeader>
            <AddUserForm
              roleId={ROLE_NURSE_ID}
              onSuccess={handleAddNurseSuccess}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-lg rounded-xl flex-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-semibold">
            Danh sách y tá
          </CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-8 w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="h-[calc(100%-8rem)] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold">Họ và tên</TableHead>
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="font-semibold">Số điện thoại</TableHead>
                <TableHead className="font-semibold">
                  Căn cước công dân
                </TableHead>
                <TableHead className="font-semibold">Địa chỉ</TableHead>
                <TableHead className="font-semibold">trạng thái</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center h-32 text-muted-foreground"
                  >
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-slate-50">
                    <TableCell className="font-medium">
                      {user.fullName}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phoneNo}</TableCell>
                    <TableCell>{user.identityId}</TableCell>
                    <TableCell
                      className="max-w-[200px] truncate"
                      title={user.addresss}
                    >
                      {user.addresss}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={user.status} />
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button variant="ghost" asChild>
                            <div className="cursor-pointer">
                              <EllipsisVertical className="h-4 w-4" />
                            </div>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem className="flex items-center gap-2">
                            <span>Khóa</span>
                            <DropdownMenuShortcut>
                              <LockKeyhole className="h-4 w-4" />
                            </DropdownMenuShortcut>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2">
                            <span>Chỉnh sửa</span>
                            <DropdownMenuShortcut>
                              <SquarePen className="h-4 w-4" />
                            </DropdownMenuShortcut>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2">
                            <span>Xóa</span>
                            <DropdownMenuShortcut>
                              <Trash2 className="h-4 w-4" />
                            </DropdownMenuShortcut>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
