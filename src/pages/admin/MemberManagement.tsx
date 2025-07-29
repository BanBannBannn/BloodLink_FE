import { banUserById, getAllAccount, unbanUserById } from "@/api/adminApi";
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
  LockKeyholeOpen,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";

interface User {
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

const ROLE_MEMBER_ID = import.meta.env.VITE_ROLE_MEMBER;

export default function AccountManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  const handleChangeStatus = async (userId: string, status: string) => {
    try {
      if (status === "Active") {
        await banUserById(userId);
      } else {
        await unbanUserById(userId);
      }
      setRefresh((prev) => !prev);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getAllUser = async () => {
      try {
        const response = await getAllAccount();
        const listMember = response.data.records.filter(
          (user: User) => user.roleId === ROLE_MEMBER_ID
        );
        setUsers(listMember);
        setFilteredUsers(listMember);
      } catch (error) {
        console.log(error);
      }
    };
    getAllUser();
  }, [refresh]);

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
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2 drop-shadow-sm">
          Quản lí người dùng
        </h1>
      </div>

      <Card className="shadow-lg rounded-xl flex-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-semibold">
            Danh sách người dùng
          </CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tên người dùng..."
                className="pl-8 w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="h-[calc(100%-5rem)] overflow-auto">
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
                <TableHead className="font-semibold">Trạng thái</TableHead>
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
                          {user.status === "Active" ? (
                            <DropdownMenuItem
                              onClick={() =>
                                handleChangeStatus(user.id, user.status)
                              }
                              className="flex items-center gap-2"
                            >
                              <span>Khóa</span>
                              <DropdownMenuShortcut>
                                <LockKeyhole className="h-4 w-4" />
                              </DropdownMenuShortcut>
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() =>
                                handleChangeStatus(user.id, user.status)
                              }
                              className="flex items-center gap-2"
                            >
                              <span>Mở Khóa</span>
                              <DropdownMenuShortcut>
                                <LockKeyholeOpen className="h-4 w-4" />
                              </DropdownMenuShortcut>
                            </DropdownMenuItem>
                          )}
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
