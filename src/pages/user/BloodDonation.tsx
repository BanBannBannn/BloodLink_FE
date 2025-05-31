import { BirthDatePicker } from "@/components/BirthDatePicker";
import { Stepper } from "@/components/Stepper";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, isToday } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const bloodTypes = ["A", "B", "AB", "O", "Chưa rõ"];
const timeSlots = [
  "07:00 - 07:30",
  "07:30 - 08:00",
  "08:00 - 08:30",
  "09:00 - 09:30",
  "09:30 - 10:00",
  "10:00 - 10:30",
  "13:30 - 14:00",
  "14:00 - 14:30",
  "14:30 - 15:00",
  "15:00 - 15:30",
  "15:30 - 16:00",
];

const Step1Schema = z.object({
  date: z.date({ required_error: "Vui lòng chọn ngày" }),
  timeSlot: z.string().nonempty("Vui lòng chọn khung giờ"),
  bloodType: z.string().nonempty("Vui lòng chọn nhóm máu"),
});

const Step2Schema = z.object({
  transfusionHistory: z.string().nonempty("Vui lòng chọn câu trả lời"),
  fluSymptoms: z.string().nonempty("Vui lòng chọn câu trả lời"),
  bleedingIncidents: z.string().nonempty("Vui lòng chọn câu trả lời"),
  drugInjection: z.string().nonempty("Vui lòng chọn câu trả lời"),
  epidemicTravel: z.string().nonempty("Vui lòng chọn câu trả lời"),
});

const Step3Schema = z.object({
  fullName: z
    .string({ required_error: "Vui lòng nhập họ và tên" })
    .nonempty("Vui lòng nhập họ và tên"),
  dateOfBirth: z.date({ required_error: "Vui lòng chọn ngày sinh" }),
  gender: z.string().nonempty("Vui lòng chọn giới tính"),
  phoneNumber: z
    .string({ required_error: "Vui lòng nhập số điện thoại" })
    .regex(/^\d+$/, "Số điện thoại chỉ chứa số")
    .length(10, "Số diện thoại gồm 10 số"),
  address: z
    .string({ required_error: "Vui lòng nhập địa chỉ" })
    .nonempty("Vui lòng nhập địa chỉ"),
  frontIdCardImage: z.instanceof(File),
  backIdCardImage: z.instanceof(File),
});

type Step1Data = z.infer<typeof Step1Schema>;
type Step2Data = z.infer<typeof Step2Schema>;
type Step3Data = z.infer<typeof Step3Schema>;

function BloodDonation() {
  const form1 = useForm<Step1Data>({
    resolver: zodResolver(Step1Schema),
    defaultValues: {
      date: undefined,
      timeSlot: "",
      bloodType: "",
    },
  });

  const form2 = useForm<Step2Data>({
    resolver: zodResolver(Step2Schema),
    defaultValues: {
      transfusionHistory: "",
      fluSymptoms: "",
      bleedingIncidents: "",
      drugInjection: "",
      epidemicTravel: "",
    },
  });

  const form3 = useForm<Step3Data>({
    resolver: zodResolver(Step3Schema),
    defaultValues: {
      fullName: "",
      dateOfBirth: undefined,
      phoneNumber: "",
      address: "",
      gender: "",
    },
  });
  const [activeStep, setActiveStep] = useState<number>(0);
  const [frontIdCardImage, setFrontIdCardImage] = useState<string | null>(null);
  const [backIdCardImage, setBackIdCardImage] = useState<string | null>(null);
  const frontIdCardInputRef = useRef<HTMLInputElement>(null);
  const backIdCardInputRef = useRef<HTMLInputElement>(null);

  const onSubmitStep1 = (data: Step1Data) => {
    console.log("Step 1 data:", data);
    setActiveStep(1);
  };

  const onSubmitStep2 = (data: Step2Data) => {
    console.log("Step 2 data:", data);
    setActiveStep(2);
  };

  const onSubmitStep3 = (data: Step3Data) => {
    console.log("form 3");
    console.log("Step 1 data:", form1.getValues());
    console.log("Step 2 data:", form2.getValues());
    console.log("Step 3 data:", data);
  };

  const selectedDate = form1.watch("date");

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
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <div className="w-full flex justify-center items-center">
          <Stepper
            steps={["Thời gian", "Khai báo y tế", "Thông tin người hiến"]}
            activeStep={activeStep}
          />
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
                  <form
                    onSubmit={form1.handleSubmit(onSubmitStep1)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form1.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <FormLabel className="text-lg font-semibold">
                            Ngày hiến máu
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full md:w-[240px] pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "dd-MM-yyyy")
                                  ) : (
                                    <span>Chọn ngày</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-full p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date <
                                  new Date(new Date().setHours(0, 0, 0, 0))
                                }
                                initialFocus
                                className="rounded-md border"
                              />
                            </PopoverContent>
                          </Popover>
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
                              {timeSlots.map((slot) => {
                                const isPassed = isPassTimeSlot(
                                  slot,
                                  selectedDate
                                );
                                return (
                                  <Button
                                    key={slot}
                                    type="button"
                                    variant={
                                      field.value === slot
                                        ? "default"
                                        : "outline"
                                    }
                                    className={cn(
                                      "w-full h-12 transition-all",
                                      field.value === slot &&
                                        "bg-primary text-primary-foreground shadow-lg scale-105"
                                    )}
                                    onClick={() => field.onChange(slot)}
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
                              {bloodTypes.map((type) => (
                                <Button
                                  key={type}
                                  type="button"
                                  variant={
                                    field.value === type ? "default" : "outline"
                                  }
                                  className={cn(
                                    "w-full h-12 transition-all",
                                    field.value === type &&
                                      "bg-primary text-primary-foreground shadow-lg scale-105"
                                  )}
                                  onClick={() => field.onChange(type)}
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
                        type="submit"
                        className="w-full md:w-[200px] h-12 text-lg font-semibold float-right"
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
                    onSubmit={form2.handleSubmit(onSubmitStep2)}
                    className="space-y-8"
                  >
                    <FormField
                      control={form2.control}
                      name="transfusionHistory"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>
                            Trước đây bạn có được truyền máu khi nằm chữa bệnh
                            tại bệnh viện không?
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="yes" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Có
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="no" />
                                </FormControl>
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
                      name="fluSymptoms"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>
                            Cách đây mấy ngày bạn có bị cảm, sốt, ho, hắt hơi sổ
                            mũi và uống thuốc Aspirin, kháng sinh, Cortisol
                            không?
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="yes" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Có
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="no" />
                                </FormControl>
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
                      name="bleedingIncidents"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>
                            Trong tháng qua bạn có bị vết cắt, kim châm, chảy
                            máu do hình xăm hình, chích lễ, xỏ lỗ tai, nhổ răng,
                            chữa răng không?
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="yes" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Có
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="no" />
                                </FormControl>
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
                      name="drugInjection"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>
                            Bạn trước đây có tiêm chích ma túy không?
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="yes" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Có
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="no" />
                                </FormControl>
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
                      name="epidemicTravel"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>
                            Bạn có sống, lưu lại hay du lịch đến vùng dịch tễ có
                            sốt rét, sốt xuất huyết, sởi trong 3 tháng gần đây
                            không?
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="yes" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Có
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="no" />
                                </FormControl>
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
                      <Button type="submit">Tiếp tục</Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {/* Step 3 */}
          {activeStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">
                  Thông tin người hiến
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form3}>
                  <form
                    onSubmit={form3.handleSubmit(onSubmitStep3)}
                    className="space-y-6 grid grid-cols-2 gap-4"
                  >
                    <FormField
                      control={form3.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Họ và tên</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Nhập họ và tên"
                              onChange={field.onChange}
                              value={field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form3.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ngày sinh</FormLabel>
                          <BirthDatePicker
                            onChange={field.onChange}
                            value={field.value}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form3.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Số điện thoại</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nhập số điện thoại"
                              onChange={field.onChange}
                              value={field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form3.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Địa chỉ</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nhập địa chỉ"
                              onChange={field.onChange}
                              value={field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form3.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem className="flex items-center">
                          <FormLabel>Giới tính</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="flex ml-10"
                            >
                              <FormItem className="flex items-center space-x-3">
                                <FormControl>
                                  <RadioGroupItem value="male" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Nam
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3">
                                <FormControl>
                                  <RadioGroupItem value="female" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Nữ
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form3.control}
                        name="frontIdCardImage"
                        render={({ field }) => (
                          <FormItem className="float-left">
                            <FormLabel>Ảnh mặt trước CMND/CCCD</FormLabel>
                            <FormControl>
                              <div>
                                <Input
                                  type="file"
                                  accept="image/*"
                                  ref={frontIdCardInputRef}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        setFrontIdCardImage(
                                          reader.result as string
                                        );
                                      };
                                      reader.readAsDataURL(file);
                                      field.onChange(file);
                                    }
                                  }}
                                />
                                {frontIdCardImage && (
                                  <img
                                    src={frontIdCardImage}
                                    alt="Preview"
                                    className="mt-2 max-h-48 max-w-full w-full h-48 rounded border object-contain"
                                  />
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form3.control}
                        name="backIdCardImage"
                        render={({ field }) => (
                          <FormItem className="float-left">
                            <FormLabel>Ảnh mặt sau CMND/CCCD</FormLabel>
                            <FormControl>
                              <div>
                                <Input
                                  type="file"
                                  accept="image/*"
                                  ref={backIdCardInputRef}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        setBackIdCardImage(
                                          reader.result as string
                                        );
                                      };
                                      reader.readAsDataURL(file);
                                      field.onChange(file);
                                    }
                                  }}
                                />
                                {backIdCardImage && (
                                  <img
                                    src={backIdCardImage}
                                    alt="Preview"
                                    className="mt-2 max-h-48 max-w-full w-full h-48 rounded border object-contain"
                                  />
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="col-span-2 flex justify-between pt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          form3.reset();
                          setActiveStep(1);
                          setFrontIdCardImage(null);
                          setBackIdCardImage(null);
                          if (frontIdCardInputRef.current)
                            frontIdCardInputRef.current.value = "";
                          if (backIdCardInputRef.current)
                            backIdCardInputRef.current.value = "";
                        }}
                      >
                        Quay lại
                      </Button>
                      <Button type="submit">Hoàn tất</Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default BloodDonation;
