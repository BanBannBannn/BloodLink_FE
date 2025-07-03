import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { Button } from "@/components/ui/button";

export default function BloodCheckFormModal({ donation, onClose }: { donation: any; onClose: () => void }) {
    const [form, setForm] = useState<Record<string, string>>({
        wbc: "",
        rbc: "",
        hgb: "",
        hct: "",
        mcv: "",
        mch: "",
        mchc: "",
        plt: "",
        mpv: "",
       
    });

    const [error, setError] = useState<string | null>(null);
    const [bloodGroups, setBloodGroups] = useState<any[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<string>("");

    // Fetch blood groups
    useEffect(() => {
        axiosInstance.get("/blood-groups")
            .then(res => setBloodGroups(res.data))
            .catch(() => setError("Không tải được danh sách nhóm máu"));
    }, [donation]);

    const handleChange = (key: string, value: string) => {
        setForm({ ...form, [key]: value });
    };

    const handleSubmit = async () => {
        try {
            await axiosInstance.post("/blood-checks", {
                ...Object.fromEntries(Object.entries(form).map(([k, v]) => [k, Number(v) || 0])),
                description: "",
                bloodGroupId: selectedGroup,
                bloodDonationId: donation.id,
            });

            alert("Gửi phiếu kiểm tra thành công!");
            onClose();
            window.location.reload();
        } catch (err: any) {
            setError(err.response?.data?.title || "Gửi thất bại!");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-[500px] max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4">Phiếu kiểm tra máu</h2>

                <div className="grid grid-cols-2 gap-4">
                    <div className="mb-3">
                        <label className="block mb-1">Nhóm máu</label>
                        <select
                            value={selectedGroup}
                            onChange={(e) => setSelectedGroup(e.target.value)}
                            className="w-full border rounded px-2 py-1"
                        >
                            <option value="">-- Chọn nhóm máu --</option>
                            {bloodGroups.map((g) => (
                                <option key={g.id} value={g.id}>
                                    {g.displayName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {[
                        "wbc", "rbc", "hgb", "hct", "mcv",
                        "mch", "mchc", "plt", "mpv",
                    ].map((key) => (
                        <div key={key}>
                            <label className="block capitalize mb-1">{key}</label>
                            <input
                                type="number"
                                value={form[key]}
                                onChange={(e) => handleChange(key, e.target.value)}
                                className="w-full px-2 py-1 border rounded"
                            />
                        </div>
                    ))}
                </div>


                <div className="mb-3">
                    <label className="block">Ghi chú</label>
                    <textarea
                        value={form.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                        className="w-full px-2 py-1 border rounded"
                    />
                </div>

                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>Đóng</Button>
                    <Button onClick={handleSubmit}>Xác nhận</Button>
                </div>
            </div>
        </div>
    );
}
