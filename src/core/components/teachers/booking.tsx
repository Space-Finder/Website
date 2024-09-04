"use client";

import axios from "axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Select from "@radix-ui/react-select";
import { Booking as PrismaBooking, Space, Course } from "@prisma/client";
import {
    CheckIcon,
    ChevronDownIcon,
    ChevronUpIcon,
} from "@radix-ui/react-icons";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

import { formatTime } from "@/core/lib/time";
import { findTime } from "@/core/lib/periods";

interface BookingTodo {
    period_number: number;
    line: number;
    course_id: string;
    common_id: string;
}

type Booking = PrismaBooking & {
    space: Space;
    course: Course;
};

interface BookingData {
    week: number;
    line: number;
    period: number;
    space_id: string;
    course_id: string;
    teacher_id: string;
}

export default function BookingPage({ teacherId }: { teacherId: string }) {
    const [classes, setClasses] = useState<Course[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [weekNumber, setWeekNumber] = useState<number | null>(null);

    const [availableSpaces, setAvailableSpaces] = useState<Space[]>([]);
    const [existingBookings, setExistingBookings] = useState<Booking[]>([]);

    const [showAlert, setShowAlert] = useState(false);
    const [selectedClass, setSelectedClass] = useState<Course | null>(null);
    const [selectedSpace, setSelectedSpace] = useState<string | null>(null);

    const [bookingsTodo, setBookingsTodo] = useState<BookingTodo[]>([]);
    const [selectedTodo, setSelectedTodo] = useState<BookingTodo | null>(null);

    useEffect(() => {
        // get the current week and save that shit
        (async () => {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/week`,
            );
            const next_week = response.data.week + 1;
            setWeekNumber(next_week);
        })();
    }, []);

    useEffect(() => {
        // fetch the classess that the teacher has
        (async () => {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/courses`,
                {
                    params: { teacher_id: teacherId },
                },
            );
            setClasses(response.data);
        })();
    }, [teacherId]);

    async function fetchBookingsTodo(course_id: string) {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/todo`,
            {
                params: { teacher_id: teacherId },
            },
        );
        setBookingsTodo(
            response.data.filter(
                (todo: BookingTodo) => todo.course_id === course_id,
            ),
        );
    }

    async function fetchExistingBookings(course_id: string) {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/bookings`,
            {
                params: { teacher_id: teacherId },
            },
        );
        setExistingBookings(
            response.data.filter(
                (booking: Booking) => booking.course.id === course_id,
            ),
        );
    }

    async function fetchAvailableSpaces(
        period: number,
        common_id: string,
        line: number,
    ) {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/spaces/available`,
            {
                params: {
                    period,
                    common_id,
                    line,
                },
            },
        );
        setAvailableSpaces(response.data);
    }

    async function handleMakeBooking() {
        if (!selectedTodo || !selectedSpace || weekNumber === null) {
            return;
        }

        const bookingData: BookingData = {
            week: weekNumber,
            line: selectedTodo.line,
            period: selectedTodo.period_number,
            space_id: selectedSpace,
            course_id: selectedTodo.course_id,
            teacher_id: teacherId,
        };

        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/bookings`,
                bookingData,
            );
            toast.success("Booking successful!");
            // Refetch data after booking cause its like changed now
            fetchBookingsTodo(selectedTodo.course_id);
            fetchExistingBookings(selectedTodo.course_id);
            setSelectedSpace(null);
            setIsDialogOpen(false);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 409) {
                toast.error("Space is already booked for this period.");
            } else {
                toast.error("An error occurred while making the booking.");
            }
        }
    }

    const handleBookingAttempt = () => {
        // if they have already booked the space another time that week
        // just confirm with them, that they are SURE they wanna be using that space again
        console.log(
            selectedTodo?.course_id!,
            selectedTodo?.line!,
            selectedTodo?.period_number,
        );

        const alreadyBookedSpace = existingBookings.find(
            (b) => b.space.id == selectedSpace,
        );

        if (alreadyBookedSpace) {
            return setShowAlert(true);
        }

        setShowAlert(false);
        handleMakeBooking();
    };

    const handleAlertClose = () => {
        setShowAlert(false);
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="mb-6 text-3xl font-extrabold text-gray-800">
                Book Your Classes for Next Week
            </h1>

            <div>
                <h2 className="mb-2 text-lg font-semibold">Select a Class</h2>

                <Select.Root
                    value={selectedClass?.id || ""}
                    onValueChange={(selectedClassId) => {
                        const classInfo = classes.find(
                            (cls) => cls.id === selectedClassId,
                        );
                        if (classInfo) {
                            setSelectedClass(classInfo);
                            fetchBookingsTodo(classInfo.id);
                            fetchExistingBookings(classInfo.id);
                        }
                    }}
                >
                    <Select.Trigger className="flex w-full items-center justify-between rounded border border-gray-300 bg-white p-3 shadow-sm hover:bg-gray-100 focus:ring-2 focus:ring-blue-500">
                        <Select.Value placeholder="Select a class..." />
                        <Select.Icon>
                            <ChevronDownIcon />
                        </Select.Icon>
                    </Select.Trigger>

                    <Select.Portal>
                        <Select.Content className="rounded border border-gray-200 bg-white shadow-lg">
                            <Select.ScrollUpButton className="flex items-center justify-center p-1">
                                <ChevronUpIcon />
                            </Select.ScrollUpButton>

                            <Select.Viewport>
                                <Select.Group>
                                    {classes.map((cls) => (
                                        <Select.Item
                                            key={cls.id}
                                            value={cls.id}
                                            className="flex cursor-pointer items-center justify-between p-2 hover:bg-gray-100"
                                        >
                                            <Select.ItemText>
                                                {cls.name} ({cls.code})
                                            </Select.ItemText>
                                            <Select.ItemIndicator>
                                                <CheckIcon />
                                            </Select.ItemIndicator>
                                        </Select.Item>
                                    ))}
                                </Select.Group>
                            </Select.Viewport>

                            <Select.ScrollDownButton className="flex items-center justify-center p-1">
                                <ChevronDownIcon />
                            </Select.ScrollDownButton>
                        </Select.Content>
                    </Select.Portal>
                </Select.Root>
            </div>

            {selectedClass && (
                <>
                    <div className="my-8">
                        <h2 className="mb-2 text-lg font-semibold">
                            Periods Already Booked
                        </h2>
                        {existingBookings.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {existingBookings.map((booking, index) => {
                                    const periodTime = findTime(
                                        booking.course.line,
                                        booking.periodNumber,
                                    );

                                    return (
                                        <div
                                            key={index}
                                            className="rounded-lg border bg-white p-4 shadow-md transition-shadow hover:shadow-lg"
                                        >
                                            <h3 className="text-md mb-2 font-semibold">
                                                {periodTime ? (
                                                    <>
                                                        {periodTime.day}{" "}
                                                        {formatTime(
                                                            periodTime.start,
                                                        )}
                                                        -
                                                        {formatTime(
                                                            periodTime.end,
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                        Period{" "}
                                                        {booking.periodNumber}
                                                    </>
                                                )}
                                            </h3>
                                            <p className="text-sm text-gray-700">
                                                Booked in: {booking.space.name}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p>
                                No bookings have been made for this class yet.
                            </p>
                        )}
                    </div>

                    <div>
                        <h2 className="mb-2 text-lg font-semibold">
                            Periods to Book
                        </h2>
                        {bookingsTodo.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {bookingsTodo.map((todo, index) => {
                                    const periodTime = findTime(
                                        todo.line,
                                        todo.period_number,
                                    );

                                    return (
                                        <div
                                            key={index}
                                            className="rounded-lg border bg-white p-4 shadow-lg"
                                        >
                                            <h3 className="text-md mb-2 font-semibold">
                                                {periodTime ? (
                                                    <>
                                                        {periodTime.day}{" "}
                                                        {formatTime(
                                                            periodTime.start,
                                                        )}
                                                        -
                                                        {formatTime(
                                                            periodTime.end,
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                        Period{" "}
                                                        {todo.period_number}
                                                    </>
                                                )}
                                            </h3>
                                            <button
                                                className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                                                onClick={() => {
                                                    setSelectedTodo(todo);
                                                    fetchAvailableSpaces(
                                                        todo.period_number,
                                                        selectedClass.commonId,
                                                        todo.line,
                                                    );
                                                    setIsDialogOpen(true);
                                                }}
                                            >
                                                Select Space
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p>All periods for this class have been booked.</p>
                        )}
                    </div>
                </>
            )}

            <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                    <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white p-6 shadow-lg">
                        <Dialog.Title className="mb-4 text-xl font-semibold">
                            Select a Space
                        </Dialog.Title>
                        <ul className="space-y-2">
                            {availableSpaces.map((space) => (
                                <li
                                    key={space.id}
                                    className={`cursor-pointer rounded border p-2 hover:bg-gray-50 ${selectedSpace === space.id ? "bg-green-100 hover:bg-green-100" : "bg-white"}`}
                                    onClick={() => setSelectedSpace(space.id)}
                                >
                                    {space.name}
                                </li>
                            ))}
                        </ul>
                        <div className="mt-6 flex justify-end">
                            {showAlert ? (
                                <AlertDialog.Root
                                    open={showAlert}
                                    onOpenChange={handleAlertClose}
                                >
                                    <AlertDialog.Trigger asChild>
                                        <button
                                            className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                                            disabled={!selectedSpace}
                                        >
                                            Book Space
                                        </button>
                                    </AlertDialog.Trigger>
                                    <AlertDialog.Portal>
                                        <AlertDialog.Overlay className="fixed inset-0 bg-black opacity-50" />
                                        <AlertDialog.Content className="fixed left-1/2 top-1/2 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white p-6 shadow-lg">
                                            <AlertDialog.Title className="text-xl font-semibold text-red-600">
                                                Are you absolutely sure?
                                            </AlertDialog.Title>
                                            <AlertDialog.Description className="mt-4 text-gray-600">
                                                You already booked this space on
                                                another day. Its recommended
                                                that you don&apos;t book a space
                                                for more than one time a week so
                                                other classes can also utilize
                                                the space.
                                            </AlertDialog.Description>
                                            <div className="mt-6 flex justify-end gap-4">
                                                <AlertDialog.Cancel asChild>
                                                    <button
                                                        onClick={
                                                            handleAlertClose
                                                        }
                                                        className="rounded bg-gray-300 px-4 py-2 text-black hover:bg-gray-400"
                                                    >
                                                        Cancel
                                                    </button>
                                                </AlertDialog.Cancel>
                                                <AlertDialog.Action asChild>
                                                    <button
                                                        className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                                                        onClick={() => {
                                                            handleMakeBooking();
                                                            handleAlertClose();
                                                        }}
                                                        disabled={
                                                            !selectedSpace
                                                        }
                                                    >
                                                        Yes, Book Space
                                                    </button>
                                                </AlertDialog.Action>
                                            </div>
                                        </AlertDialog.Content>
                                    </AlertDialog.Portal>
                                </AlertDialog.Root>
                            ) : (
                                <button
                                    className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                                    onClick={handleBookingAttempt}
                                    disabled={!selectedSpace}
                                >
                                    Book Space
                                </button>
                            )}

                            <Dialog.Close asChild>
                                <button
                                    onClick={() => setSelectedSpace(null)}
                                    className="ml-4 rounded bg-gray-300 px-4 py-2 text-black hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                            </Dialog.Close>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    );
}
