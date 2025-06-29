import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  UserGroupIcon,
  UserIcon,
  EyeIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { getAllAccount } from "@/api/adminApi";
import type { User } from "./NurseManagement";

const ROLE_MEMBER_ID = import.meta.env.VITE_ROLE_MEMBER;
const ROLE_NURSE_ID = import.meta.env.VITE_ROLE_NURSE;
const ROLE_SUPERVISOR_ID = import.meta.env.VITE_ROLE_SUPERVISOR;

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [numberOfMember, setNumberOfMember] = useState<number>(0);
  const [numberOfNurse, setNumberOfNurse] = useState<number>(0);
  const [numberOfSupervisor, setNumberOfSupervisor] = useState<number>(0);
  // Sample data for the chart
  const data = [
    { name: "Người dùng", value: numberOfMember },
    { name: "Y tá", value: numberOfNurse },
    { name: "Giám sát", value: numberOfSupervisor },
  ];

  const cardData = [
    {
      title: "Tổng số người dùng",
      value: numberOfMember + numberOfNurse + numberOfSupervisor,
      icon: <UsersIcon className="w-8 h-8 text-blue-500" />,
    },
    {
      title: "Số y tá",
      value: numberOfNurse,
      icon: <UserGroupIcon className="w-8 h-8 text-green-500" />,
    },
    {
      title: "Số giám sát",
      value: numberOfSupervisor,
      icon: <EyeIcon className="w-8 h-8 text-purple-500" />,
    },
    {
      title: "Số người dùng",
      value: numberOfMember,
      icon: <UserIcon className="w-8 h-8 text-pink-500" />,
    },
  ];

  useEffect(() => {
    const getAllUser = async () => {
      try {
        const response = await getAllAccount();
        setUsers(response.data.records);
      } catch (error) {
        console.log(error);
      }
    };
    getAllUser();
  }, []);

  useEffect(() => {
    const getNumberOfEachRole = () => {
      const listMember = users.filter(
        (user: User) => user.roleId === ROLE_MEMBER_ID
      );
      const listNurse = users.filter(
        (user: User) => user.roleId === ROLE_NURSE_ID
      );
      const listSupervisor = users.filter(
        (user: User) => user.roleId === ROLE_SUPERVISOR_ID
      );
      setNumberOfMember(listMember.length);
      setNumberOfNurse(listNurse.length);
      setNumberOfSupervisor(listSupervisor.length);
    };
    getNumberOfEachRole();
  }, [users]);

  return (
    <div className="flex-1 p-6">
      <div>
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2 drop-shadow-sm">
          Bảng điều khiển quản trị
        </h1>
        <p className="text-lg text-gray-500 mb-8">
          Tổng quan về hệ thống và các chỉ số quan trọng
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {cardData.map((card, idx) => (
          <Card
            key={idx}
            className="transition-transform hover:scale-105 hover:shadow-xl shadow-md border-0 bg-white/90"
          >
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              {card.icon}
              <CardTitle className="text-base font-semibold text-gray-700 flex-1">
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-4xl font-bold text-gray-900">
                {card.value}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="bg-white rounded-xl p-8 shadow-lg mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Biểu đồ tổng quan
        </h2>
        <ChartContainer
          config={{ value: { label: "Số lượng", color: "#ef4444" } }}
          className="h-96"
        >
          <BarChart
            data={data}
            margin={{ top: 10, right: 0, left: 0, bottom: 50 }}
          >
            <CartesianGrid strokeDasharray="4 4" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#ef4444" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}
