import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function BloodCheckFormModal({
    donation,
    onClose,
}: {
    donation: any;
    onClose: () => void;
}) {
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

    const [bloodGroups, setBloodGroups] = useState<any[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const inputFields = [
        { key: "wbc", label: "Wbc (4-10)" },
        { key: "rbc", label: "Rbc (4.2-6.1)" },
        { key: "hgb", label: "Hgb (12.5-17.5)" },
        { key: "hct", label: "Hct (36-52)" },
        { key: "mcv", label: "Mcv (80-100)" },
        { key: "mch", label: "Mch (27-33)" },
        { key: "mchc", label: "Mchc (32-36)" },
        { key: "plt", label: "Plt (150-450)" },
        { key: "mpv", label: "Mpv (7.5-11.5)" },
    ];

    useEffect(() => {
        axiosInstance
            .get("/blood-groups")
            .then((res) => setBloodGroups(res.data))
            .catch(() => setError("Không tải được danh sách nhóm máu"));
    }, [donation]);

    const handleChange = (key: string, value: string) => {
        setForm({ ...form, [key]: value });
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError(null);

        try {
            const payload = {
                ...Object.fromEntries(
                    Object.entries(form).map(([k, v]) => [
                        k,
                        ["description"].includes(k) ? v : Number(v),
                    ])
                ),
                bloodGroupId: selectedGroup, // giữ nguyên kiểu string
                bloodDonationId: donation.id,
            };

            console.log("Payload gửi:", payload);

            await axiosInstance.post("/blood-checks", payload);
            setSuccessMessage("Gửi phiếu kiểm tra thành công!");
        } catch (err: any) {
            setError(err.response?.data?.title || "Gửi thất bại!");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-[500px] max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4">Phiếu kiểm tra máu</h2>

                <div className="grid grid-cols-2 gap-4">
                    <div className="mb-3 col-span-2">
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

                    {inputFields.map(({ key, label }) => (
                        <div key={key}>
                            <label className="block mb-1">{label}</label>
                            <input
                                type="number"
                                value={form[key]}
                                onChange={(e) => handleChange(key, e.target.value)}
                                className="w-full px-2 py-1 border rounded"
                            />
                        </div>
                    ))}
                </div>

                <div className="mb-3 mt-3 col-span-2">
                    <label className="block">Ghi chú</label>
                    <textarea
                        value={form.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                        className="w-full px-2 py-1 border rounded"
                    />
                </div>

                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                        Đóng
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? "Đang gửi..." : "Xác nhận"}
                    </Button>
                </div>
            </div>

            {successMessage && (
                <AlertDialog
                    open={!!successMessage}
                    onOpenChange={() => {
                        setSuccessMessage(null);
                        onClose();
                    }}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Thành công</AlertDialogTitle>
                            <AlertDialogDescription>{successMessage}</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogAction>Đóng</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
    );
}
