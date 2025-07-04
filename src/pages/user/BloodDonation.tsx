import { bloodDonationRequest } from "@/api/userApi";
import { Stepper } from "@/components/Stepper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { bloodTypes, timeSlots } from "@/constants/constants";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, isToday } from "date-fns";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

const Step1Schema = z.object({
  donatedDateRequest: z.string().nonempty("Vui lòng chọn ngày"),
  timeSlot: z.number().min(0, "Vui lòng chọn khung giờ"),
  bloodType: z.number().min(0, "Vui lòng chọn nhóm máu"),
});

const Step2Schema = z.object({
  hasBloodTransfusionHistory: z
    .boolean()
    .optional()
    .refine((val) => typeof val === "boolean", {
      message: "Vui lòng chọn câu trả lời",
    }),
  hasRecentIllnessOrMedication: z
    .boolean()
    .optional()
    .refine((val) => typeof val === "boolean", {
      message: "Vui lòng chọn câu trả lời",
    }),
  hasRecentSkinPenetrationOrSurgery: z
    .boolean()
    .optional()
    .refine((val) => typeof val === "boolean", {
      message: "Vui lòng chọn câu trả lời",
    }),
  hasDrugInjectionHistory: z
    .boolean()
    .optional()
    .refine((val) => typeof val === "boolean", {
      message: "Vui lòng chọn câu trả lời",
    }),
  hasVisitedEpidemicArea: z
    .boolean()
    .optional()
    .refine((val) => typeof val === "boolean", {
      message: "Vui lòng chọn câu trả lời",
    }),
});

type Step1Data = z.infer<typeof Step1Schema>;
type Step2Data = {
  hasBloodTransfusionHistory?: boolean;
  hasRecentIllnessOrMedication?: boolean;
  hasRecentSkinPenetrationOrSurgery?: boolean;
  hasDrugInjectionHistory?: boolean;
  hasVisitedEpidemicArea?: boolean;
};

function BloodDonation() {
  const form1 = useForm<Step1Data>({
    resolver: zodResolver(Step1Schema),
    defaultValues: {
      donatedDateRequest: "",
      timeSlot: -1,
      bloodType: -1,
    },
  });

  const form2 = useForm<Step2Data>({
    resolver: zodResolver(Step2Schema),
    defaultValues: {
      hasBloodTransfusionHistory: undefined,
      hasRecentIllnessOrMedication: undefined,
      hasRecentSkinPenetrationOrSurgery: undefined,
      hasDrugInjectionHistory: undefined,
      hasVisitedEpidemicArea: undefined,
    },
  });

  const [activeStep, setActiveStep] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data: Step2Data) => {
    setLoading(true);
    setErrorMsg("");
    const dataToSubmit = { ...form1.getValues(), ...data, reasonReject: "" };
    try {
      const response = await bloodDonationRequest(dataToSubmit);
      console.log(response.data);
      setShowSuccessDialog(true);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg("Đã xảy ra lỗi, vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  const selectedDate = form1.watch("donatedDateRequest");

  const isPassTimeSlot = (timeSlot: string, selectedDate: Date | undefined) => {
    if (!selectedDate) return true;

    if (isToday(selectedDate)) {
      const currentTime = new Date();
      const [, endTime] = timeSlot.split("-");
      const [endHour, endMinute] = endTime.split(":").map(Number);
      const endDateTime = new Date();
      endDateTime.setHours(endHour, endMinute, 0, 0);
      return currentTime > endDateTime;
    }
    return false;
  };

  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto px-4 mt-8 mb-8">
        {/* Centered Stepper */}
        <div className="flex justify-center my-12">
          <div className="w-full max-w-xl">
            <Stepper
              steps={["Thời gian", "Khai báo y tế"]}
              activeStep={activeStep}
            />
          </div>
        </div>

        <div className="mt-8">
          {/* step 1 */}
          {activeStep === 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">
                  Đặt lịch hiến máu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form1}>
                  <form className="space-y-6">
                    <FormField
                      control={form1.control}
                      name="donatedDateRequest"
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <FormLabel className="text-lg font-semibold">
                            Ngày hiến máu
                          </FormLabel>
                          <FormControl>
                            <Popover
                              open={calendarOpen}
                              onOpenChange={setCalendarOpen}
                            >
                              <PopoverTrigger className="!flex justify-start">
                                <Button
                                  type="button"
                                  variant="outline"
                                  className={cn(
                                    "w-full md:w-[240px] pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                  id={field.name}
                                  aria-describedby={field.name}
                                  aria-invalid={
                                    !!form1.formState.errors.donatedDateRequest
                                  }
                                  onClick={() => setCalendarOpen(true)}
                                >
                                  {field.value ? (
                                    format(
                                      new Date(field.value + "T00:00:00"),
                                      "dd-MM-yyyy"
                                    )
                                  ) : (
                                    <span>Chọn ngày</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={
                                    field.value
                                      ? new Date(field.value + "T00:00:00")
                                      : undefined
                                  }
                                  onSelect={(date) => {
                                    field.onChange(
                                      date ? format(date, "yyyy-MM-dd") : ""
                                    );
                                    setCalendarOpen(false);
                                  }}
                                  disabled={(date) =>
                                    date <
                                    new Date(new Date().setHours(0, 0, 0, 0))
                                  }
                                  className="rounded-md border"
                                />
                              </PopoverContent>
                            </Popover>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form1.control}
                      name="timeSlot"
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <FormLabel className="text-lg font-semibold">
                            Khung giờ
                          </FormLabel>
                          <FormControl>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {timeSlots.map((slot, index) => {
                                const isPassed = isPassTimeSlot(
                                  slot,
                                  selectedDate
                                    ? new Date(selectedDate)
                                    : undefined
                                );
                                return (
                                  <Button
                                    key={slot}
                                    type="button"
                                    variant={
                                      field.value === index
                                        ? "default"
                                        : "outline"
                                    }
                                    className={cn(
                                      "w-full h-12 transition-all",
                                      field.value === index &&
                                        "bg-primary text-primary-foreground shadow-lg scale-105"
                                    )}
                                    onClick={() => field.onChange(index)}
                                    disabled={isPassed}
                                  >
                                    {slot}
                                  </Button>
                                );
                              })}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form1.control}
                      name="bloodType"
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <FormLabel className="text-lg font-semibold">
                            Nhóm máu
                          </FormLabel>
                          <FormControl>
                            <div className="grid grid-cols-5 gap-4">
                              {bloodTypes.map((type, index) => (
                                <Button
                                  key={type}
                                  type="button"
                                  variant={
                                    field.value === index
                                      ? "default"
                                      : "outline"
                                  }
                                  className={cn(
                                    "w-full h-12 transition-all",
                                    field.value === index &&
                                      "bg-primary text-primary-foreground shadow-lg scale-105"
                                  )}
                                  onClick={() => field.onChange(index)}
                                >
                                  {type}
                                </Button>
                              ))}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="pt-6">
                      <Button
                        type="button"
                        className="w-full md:w-[200px] h-12 text-lg font-semibold float-right"
                        onClick={async () => {
                          const valid = await form1.trigger();
                          if (valid) {
                            setActiveStep(1);
                          }
                        }}
                      >
                        Tiếp tục
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {/* Step 2 */}
          {activeStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">
                  Khai báo y tế
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form2}>
                  <form
                    onSubmit={form2.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    <FormField
                      control={form2.control}
                      name="hasBloodTransfusionHistory"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>
                            Trước đây bạn có được truyền máu khi nằm chữa bệnh
                            tại bệnh viện không?
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={(val) =>
                                field.onChange(val === "true")
                              }
                              value={String(field.value)}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <RadioGroupItem value="true" />
                                <FormLabel className="font-normal">
                                  Có
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <RadioGroupItem value="false" />
                                <FormLabel className="font-normal">
                                  Không
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form2.control}
                      name="hasRecentIllnessOrMedication"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>
                            Cách đây mấy ngày bạn có bị cảm, sốt, ho, hắt hơi sổ
                            mũi và uống thuốc Aspirin, kháng sinh, Cortisol
                            không?
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={(val) =>
                                field.onChange(val === "true")
                              }
                              value={String(field.value)}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <RadioGroupItem value="true" />
                                <FormLabel className="font-normal">
                                  Có
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <RadioGroupItem value="false" />
                                <FormLabel className="font-normal">
                                  Không
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form2.control}
                      name="hasRecentSkinPenetrationOrSurgery"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>
                            Trong tháng qua bạn có bị vết cắt, kim châm, chảy
                            máu do hình xăm hình, chích lễ, xỏ lỗ tai, nhổ răng,
                            chữa răng không?
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={(val) =>
                                field.onChange(val === "true")
                              }
                              value={String(field.value)}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <RadioGroupItem value="true" />
                                <FormLabel className="font-normal">
                                  Có
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <RadioGroupItem value="false" />
                                <FormLabel className="font-normal">
                                  Không
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form2.control}
                      name="hasDrugInjectionHistory"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>
                            Bạn trước đây có tiêm chích ma túy không?
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={(val) =>
                                field.onChange(val === "true")
                              }
                              value={String(field.value)}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <RadioGroupItem value="true" />
                                <FormLabel className="font-normal">
                                  Có
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <RadioGroupItem value="false" />
                                <FormLabel className="font-normal">
                                  Không
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form2.control}
                      name="hasVisitedEpidemicArea"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>
                            Bạn có sống, lưu lại hay du lịch đến vùng dịch tễ có
                            sốt rét, sốt xuất huyết, sởi trong 3 tháng gần đây
                            không?
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={(val) =>
                                field.onChange(val === "true")
                              }
                              value={String(field.value)}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <RadioGroupItem value="true" />
                                <FormLabel className="font-normal">
                                  Có
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <RadioGroupItem value="false" />
                                <FormLabel className="font-normal">
                                  Không
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-between pt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          form2.reset();
                          setActiveStep(0);
                        }}
                      >
                        Quay lại
                      </Button>
                      <Button type="submit" disabled={loading}>
                        {loading ? "Đang gửi..." : "Hoàn tất"}
                      </Button>
                    </div>
                    {errorMsg && (
                      <div className="text-red-500 mt-2">{errorMsg}</div>
                    )}
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Đăng ký hiến máu thành công!</DialogTitle>
            <DialogDescription>
              Cảm ơn bạn đã đăng ký hiến máu. Chúng tôi sẽ liên hệ với bạn sớm.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-center gap-4">
            <Button
              onClick={() => {
                setShowSuccessDialog(false);
                navigate("/");
              }}
            >
              Về trang chủ
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowSuccessDialog(false);
                navigate("/blood-donation-history");
              }}
            >
              Xem lịch sử đăng ký
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default BloodDonation;
