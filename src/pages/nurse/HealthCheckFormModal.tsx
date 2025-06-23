import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axios";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Props {
    request: any;
    onClose: () => void;
}

export default function HealthCheckFormModal({ request, onClose }: Props) {
    const existing = request.healthCheckForm;
    const isViewMode = request.status !== 0 || !!existing;

    const [age, setAge] = useState(existing?.age );
    const [weight, setWeight] = useState(existing?.weight );
    const [volume, setVolume] = useState(existing?.volumeBloodDonated || 250);
    const [hemoglobin, setHemoglobin] = useState(existing?.hemoglobin );

    const [isInfectiousDisease, setIsInfectiousDisease] = useState(existing?.isInfectiousDisease || false);
    const [isPregnant, setIsPregnant] = useState(existing?.isPregnant || false);
    const [isUsedAlcoholRecently, setIsUsedAlcoholRecently] = useState(existing?.isUsedAlcoholRecently || false);
    const [hasChronicDisease, setHasChronicDisease] = useState(existing?.hasChronicDisease || false);
    const [hasUnsafeSexualBehaviourOrSameSexSexualContact] = useState(existing?.hasUnsafeSexualBehaviourOrSameSexSexualContact || false);
    const [note, setNote] = useState(existing?.note || "");

    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    const handleSubmit = async () => {
        setFieldErrors({});
        setAlertMessage(null);
        try {
            await axiosInstance.post("/api/health-check-form", {
                age,
                weight,
                volumeBloodDonated: volume,
                hemoglobin,
                isInfectiousDisease,
                isPregnant,
                isUsedAlcoholRecently,
                hasChronicDisease,
                hasUnsafeSexualBehaviourOrSameSexSexualContact,
                note: note || "Không có ghi chú",
                bloodDonateRequestId: request.id,
            });

            alert("Điền form thành công!");
            onClose();
        } catch (err: any) {
            const errors = err.response?.data?.errors;
            if (errors) {
                const mapped: { [key: string]: string } = {};
                for (const key in errors) {
                    mapped[key] = errors[key][0];
                }
                setFieldErrors(mapped);
            } else {
                setAlertMessage(err.response?.data?.title || "Có lỗi xảy ra!");
            }
        }
    };

    const disabled = isViewMode;

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4 w-96 max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-semibold mb-2">Phiếu kiểm tra</h2>

                {alertMessage && (
                    <Alert variant="destructive" className="mb-2">
                        <AlertTitle>Lỗi</AlertTitle>
                        <AlertDescription>{alertMessage}</AlertDescription>
                    </Alert>
                )}

                {/* Tuổi, cân nặng, huyết sắc tố */}
                {[{ label: "Tuổi", value: age, set: setAge, key: "age" },
                { label: "Cân nặng (kg)", value: weight, set: setWeight, key: "weight" },
                { label: "Huyết sắc tố (g/l)", value: hemoglobin, set: setHemoglobin, key: "hemoglobin" }].map(({ label, value, set, key }) => (
                    <div className="mb-2" key={key}>
                        <label>{label}:</label>
                        <input
                            type="string"
                            value={value}
                            disabled={disabled}
                            onChange={(e) => set(parseInt(e.target.value) || 0)}
                            className="border rounded w-full px-2 py-1 mt-1"
                        />
                        {fieldErrors[key] && (
                            <p className="text-red-500 text-sm mt-1">{fieldErrors[key]}</p>
                        )}
                    </div>
                ))}

                {/* Thể tích máu */}
                <div className="mb-2">
                    <label>Thể tích máu (ml):</label>
                    <select
                        value={volume}
                        onChange={(e) => setVolume(parseInt(e.target.value))}
                        disabled={disabled}
                        className="border rounded w-full px-2 py-1 mt-1"
                    >
                        {[250, 350, 450].map((val) => (
                            <option key={val} value={val}>
                                {val}
                            </option>
                        ))}
                    </select>
                    {fieldErrors["volumeBloodDonated"] && (
                        <p className="text-red-500 text-sm mt-1">{fieldErrors["volumeBloodDonated"]}</p>
                    )}
                </div>

                {/* Checkbox */}
                {[{ label: "Có bệnh truyền nhiễm", value: isInfectiousDisease, set: setIsInfectiousDisease },
                { label: "Mang thai", value: isPregnant, set: setIsPregnant },
                { label: "Dùng rượu gần đây", value: isUsedAlcoholRecently, set: setIsUsedAlcoholRecently },
                { label: "Bệnh mãn tính", value: hasChronicDisease, set: setHasChronicDisease }].map(({ label, value, set }) => (
                    <div className="mb-2" key={label}>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={value}
                                onChange={(e) => set(e.target.checked)}
                                disabled={disabled}
                            />
                            {label}
                        </label>
                    </div>
                ))}

                {/* Ghi chú */}
                <div className="mb-2">
                    <label>Ghi chú:</label>
                    <textarea
                        value={note}
                        disabled={disabled}
                        onChange={(e) => setNote(e.target.value)}
                        className="border rounded w-full px-2 py-1 mt-1"
                        rows={2}
                    />
                </div>

                {/* Action buttons */}
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>
                        Đóng
                    </Button>
                    {!disabled && <Button onClick={handleSubmit}>Xác nhận</Button>}
                </div>
            </div>
        </div>
    );
}
