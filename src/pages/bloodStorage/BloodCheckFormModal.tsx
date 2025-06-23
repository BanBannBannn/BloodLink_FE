import React, { useState } from "react";
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
        description: "",
    });

    const [error, setError] = useState<string | null>(null);

    const handleChange = (key: string, value: string) => {
        setForm({ ...form, [key]: value });
    };

    const handleSubmit = async () => {
        try {
            await axiosInstance.post("/api/blood-checks", {
                ...Object.fromEntries(
                    Object.entries(form).map(([k, v]) => [k, Number(v) || 0])
                ),
                bloodGroupId: donation.bloodDonationRequest?.bloodGroupId || "",
                bloodDonationId: donation.id,
            });
            alert("Gửi phiếu kiểm tra thành công!");
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.title || "Gửi thất bại!");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-[500px] max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4">Phiếu kiểm tra máu</h2>
                {["wbc", "rbc", "hgb", "hct", "mcv", "mch", "mchc", "plt", "mpv"].map((key) => (
                    <div key={key} className="mb-2">
                        <label className="block capitalize">{key}</label>
                        <input
                            type="number"
                            value={form[key]}
                            onChange={(e) => handleChange(key, e.target.value)}
                            className="w-full px-2 py-1 border rounded"
                        />
                    </div>
                ))}
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
