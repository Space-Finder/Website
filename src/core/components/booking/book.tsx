"use client";

import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Course, Teacher, Space, Booking as DBBooking } from "@prisma/client";

import { formatTime } from "@lib/times";
import { Period as FullPeriod } from "@core/types/timetable";

type Period = Extract<FullPeriod, { periodType: "CLASS" }>;
type Booking = DBBooking & { space: Space; course: Course };

// TODO: implement this
const findTime = (line: number, period: number) => {
    return null;
};

async function getBookings(courseId: string, teacherId: string, week: number) {
    const response = await axios.get(`/api/bookings`, {
        params: {
            courseId,
            teacherId,
            week,
        },
        withCredentials: true,
    });
    return response.data;
}

async function getAvailableSpaces(
    periodNumber: number,
    line: number,
    commonId: string,
    week: number,
) {
    const response = await axios.get(`/api/spaces`, {
        params: {
            periodNumber,
            line,
            commonId,
            week,
        },
    });
    return response.data.availableSpaces;
}

export default function BookingData({
    week,
    course,
    teacher,
}: {
    week: number;
    course: Course;
    teacher: Teacher;
}) {
    const queryClient = useQueryClient();
    const router = useRouter();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    const [availableSpaces, setAvailableSpaces] = useState<Space[]>([]);
    const [selectedSpace, setSelectedSpace] = useState<string | null>(null);
    const [selectedTodo, setSelectedTodo] = useState<Period | null>(null);

    const { data, isLoading, error } = useQuery({
        queryKey: ["bookings", course.id, week, teacher.id],
        queryFn: async () => await getBookings(course.id, teacher.id, week),
    });

    const bookingMutation = useMutation({
        mutationFn: async (newBooking: {
            periodNumber: number;
            teacherId: string;
            courseId: string;
            spaceId: string;
            week: number;
        }) => {
            await axios.post(`/api/bookings`, newBooking);
        },
        onSuccess: () => {
            toast.success("Booking successful!");
            queryClient.invalidateQueries({
                queryKey: ["bookings", course.id, week, teacher.id],
            });
            setIsDialogOpen(false);
            setSelectedSpace(null);
            setSelectedTodo(null);
        },
        onError: (error: any) => {
            if (axios.isAxiosError(error) && error.response?.status === 409) {
                toast.error("Space is already booked for this period.");
            } else {
                toast.error("An error occurred while making the booking.");
            }
        },
    });

    useEffect(() => {
        if (course.teacherId !== teacher.id) {
            router.push(`/dashboard/book?teacher=${teacher.code}`);
        }
    }, [teacher]);

    const fetchAvailableSpaces = async (period: Period) => {
        try {
            const availableSpaces = await getAvailableSpaces(
                period.periodNumber,
                period.line,
                course.commonId,
                week,
            );
            setAvailableSpaces(availableSpaces);
        } catch {
            toast.error("Error fetching available spaces.");
        }
    };

    const handleMakeBooking = () => {
        if (!selectedTodo || !selectedSpace) return;

        bookingMutation.mutate({
            periodNumber: selectedTodo.periodNumber,
            teacherId: teacher.id,
            courseId: course.id,
            spaceId: selectedSpace,
            week: week,
        });
    };

    const handleBookingAttempt = () => {
        const alreadyBookedSpace = bookingsMade.find(
            (b) => b && b.spaceId === selectedSpace,
        );

        if (alreadyBookedSpace) {
            return setShowAlert(true);
        }

        handleMakeBooking();
    };

    const handleAlertClose = () => {
        setShowAlert(false);
    };

    const {
        periodsBooked,
        periodsToBook,
        bookingsMade,
    }: {
        periodsBooked: Period[];
        periodsToBook: Period[];
        bookingsMade: Booking[];
    } = data || {
        periodsBooked: [],
        periodsToBook: [],
        bookingsMade: [],
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error fetching data.</div>;
    }

    return (
        <div className="container mx-auto p-6">
            {/* Periods Already Booked */}
            <div className="my-8">
                <h2 className="mb-2 text-lg font-semibold">
                    Periods Already Booked
                </h2>
                {periodsBooked.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {bookingsMade.map((booking, index) => {
                            if (!booking) {
                                return;
                            }

                            const periodTime = findTime(
                                booking.course.line,
                                booking.periodNumber,
                            );
                            return (
                                <div
                                    key={index}
                                    className="rounded-lg border bg-white p-4 shadow-md"
                                >
                                    <h3 className="text-md mb-2 font-semibold">
                                        {periodTime || (
                                            <>Period {booking.periodNumber}</>
                                        )}
                                    </h3>
                                    <p className="text-sm text-gray-700">
                                        Booked in: {booking.space.name || "e"}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p>No bookings have been made for this class yet.</p>
                )}
            </div>

            {/* Periods to Book */}
            <div>
                <h2 className="mb-2 text-lg font-semibold">Periods to Book</h2>
                {periodsToBook.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {periodsToBook.map((todo: Period, index: number) => {
                            const periodTime = findTime(
                                todo.line,
                                todo.periodNumber,
                            );
                            return (
                                <div
                                    key={index}
                                    className="rounded-lg border bg-white p-4 shadow-lg"
                                >
                                    <h3 className="text-md mb-2 font-semibold">
                                        {periodTime || (
                                            <>
                                                Period {todo.periodNumber}{" "}
                                                {formatTime(todo.startTime)} -{" "}
                                                {formatTime(todo.endTime)}
                                            </>
                                        )}
                                    </h3>
                                    <button
                                        className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                                        onClick={() => {
                                            setSelectedTodo(todo);
                                            fetchAvailableSpaces(todo);
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

            {/* Dialog for selecting space */}
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
                                    className={`cursor-pointer rounded border p-2 hover:bg-gray-50 ${selectedSpace === space.id ? "bg-green-100" : ""}`}
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
                                            <AlertDialog.Title className="text-xl font-bold">
                                                Space Already Booked
                                            </AlertDialog.Title>
                                            <AlertDialog.Description className="mt-4 text-gray-600">
                                                You have already booked this
                                                space for another period. Are
                                                you sure you want to proceed?
                                            </AlertDialog.Description>
                                            <div className="mt-6 flex justify-end space-x-4">
                                                <AlertDialog.Cancel asChild>
                                                    <button className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400">
                                                        Cancel
                                                    </button>
                                                </AlertDialog.Cancel>
                                                <AlertDialog.Action asChild>
                                                    <button
                                                        className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                                                        onClick={
                                                            handleMakeBooking
                                                        }
                                                    >
                                                        Yes, Proceed
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
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    );
}
