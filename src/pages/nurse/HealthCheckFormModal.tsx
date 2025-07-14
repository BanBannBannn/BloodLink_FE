import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axios";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface Props {
    request: any;
    onClose: (shouldRefresh?: boolean) => void;
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
    const [hasUnsafeSexualBehaviourOrSameSexSexualContact, setHasUnsafeSexualBehaviourOrSameSexSexualContact] = useState(existing?.hasUnsafeSexualBehaviourOrSameSexSexualContact || false);
    const [note, setNote] = useState(existing?.note || "");
    const [reasonForRejection, setReasonForRejection] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    const handleDecision = async (approved: boolean) => {
        setIsSubmitting(true);
        setAlertMessage(null);

        if (!approved && !reasonForRejection.trim()) {
            setAlertMessage("Vui lòng nhập lý do từ chối.");
            setIsSubmitting(false);
            return;
        }

        try {
            await axiosInstance.post("/health-check-form", {
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
                isApproved: approved,
                reasonForRejection: approved ? undefined : reasonForRejection,
            });

            onClose(true);
        } catch (err: any) {
            setAlertMessage(err.response?.data?.title || "Có lỗi xảy ra!");
        } finally {
            setIsSubmitting(false);
        }
    };

    const disabled = isViewMode || isSubmitting;

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4 w-96 max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-semibold mb-2">Phiếu kiểm tra</h2>

                <AlertDialog open={!!alertMessage} onOpenChange={() => setAlertMessage(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Lỗi</AlertDialogTitle>
                            <AlertDialogDescription>{alertMessage}</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogAction onClick={() => setAlertMessage(null)}>Đóng</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {[{ label: "Tuổi", value: age, set: setAge },
                { label: "Cân nặng (kg)", value: weight, set: setWeight },
                { label: "Huyết sắc tố (g/l)", value: hemoglobin, set: setHemoglobin }].map(({ label, value, set }) => (
                    <div className="mb-2" key={label}>
                        <label>{label}:</label>
                        <input
                            type="number"
                            value={value}
                            disabled={disabled}
                            onChange={(e) => set(parseInt(e.target.value) || 0)}
                            className="border rounded w-full px-2 py-1 mt-1"
                        />
                    </div>
                ))}

                <div className="mb-2">
                    <label>Thể tích máu (ml):</label>
                    <select
                        value={volume}
                        onChange={(e) => setVolume(parseInt(e.target.value))}
                        disabled={disabled}
                        className="border rounded w-full px-2 py-1 mt-1"
                    >
                        {[250, 350, 450, 500].map((val) => (
                            <option key={val} value={val}>{val}</option>
                        ))}
                    </select>
                </div>

                {[{ label: "Có bệnh truyền nhiễm", value: isInfectiousDisease, set: setIsInfectiousDisease },
                { label: "Mang thai", value: isPregnant, set: setIsPregnant },
                { label: "Dùng rượu gần đây", value: isUsedAlcoholRecently, set: setIsUsedAlcoholRecently },
                { label: "Bệnh mãn tính", value: hasChronicDisease, set: setHasChronicDisease },
                { label: "Hành vi tình dục không an toàn hoặc đồng giới", value: hasUnsafeSexualBehaviourOrSameSexSexualContact, set: setHasUnsafeSexualBehaviourOrSameSexSexualContact },
                ].map(({ label, value, set }) => (
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

                {!disabled && (
                    <div className="mb-2">
                        <label>Lý do từ chối:</label>
                        <textarea
                            value={reasonForRejection}
                            onChange={(e) => setReasonForRejection(e.target.value)}
                            className="border rounded w-full px-2 py-1 mt-1"
                            rows={2}
                        />
                    </div>
                )}

                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => onClose()} disabled={isSubmitting}>
                        Đóng
                    </Button>
                    {!disabled && (
                        <>
                            <Button
                                onClick={() => handleDecision(true)}
                                disabled={isSubmitting}
                                className="bg-green-600 hover:bg-green-700 text-white"
                            >
                                Duyệt
                            </Button>
                            <Button
                                onClick={() => handleDecision(false)}
                                disabled={isSubmitting}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                Từ chối
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
