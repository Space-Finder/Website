"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { toast, ToastContainer } from "react-toastify";

import { Booking as PrismaBooking, Space, Course } from "@prisma/client";

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
            setSelectedClass(null);
            setIsDialogOpen(false);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 409) {
                toast.error("Space is already booked for this period.");
            } else {
                toast.error("An error occurred while making the booking.");
            }
        }
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="mb-4 text-2xl font-bold">
                Book Your Classes for Next Week
            </h1>

            <div className="mb-6">
                <h2 className="mb-2 text-lg font-semibold">Select a Class</h2>
                <select
                    className="w-full rounded border p-2"
                    value={selectedClass?.id || ""}
                    onChange={(e) => {
                        const selectedClassId = e.target.value;
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
                    <option value="" disabled>
                        Select a class...
                    </option>
                    {classes.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                            {cls.name}
                        </option>
                    ))}
                </select>
            </div>

            {selectedClass && (
                <>
                    <div className="mb-6">
                        <h2 className="mb-2 text-lg font-semibold">
                            Periods Already Booked
                        </h2>
                        {existingBookings.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {existingBookings.map((booking, index) => (
                                    <div
                                        key={index}
                                        className="rounded-lg border bg-white p-4 shadow-lg"
                                    >
                                        <h3 className="text-md mb-2 font-semibold">
                                            Period {booking.periodNumber}
                                        </h3>
                                        <p className="text-sm text-gray-700">
                                            Booked in: {booking.space.name}
                                        </p>
                                    </div>
                                ))}
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
                                {bookingsTodo.map((todo, index) => (
                                    <div
                                        key={index}
                                        className="rounded-lg border bg-white p-4 shadow-lg"
                                    >
                                        <h3 className="text-md mb-2 font-semibold">
                                            Period {todo.period_number}
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
                                ))}
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
                                    className={`cursor-pointer rounded border p-2 ${selectedSpace === space.id ? "bg-green-100" : "bg-white"}`}
                                    onClick={() => setSelectedSpace(space.id)}
                                >
                                    {space.name}
                                </li>
                            ))}
                        </ul>
                        <div className="mt-6 flex justify-end">
                            <button
                                className="mr-2 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                                onClick={handleMakeBooking}
                                disabled={!selectedSpace}
                            >
                                Book Space
                            </button>
                            <Dialog.Close asChild>
                                <button className="rounded bg-gray-300 px-4 py-2 text-black hover:bg-gray-400">
                                    Cancel
                                </button>
                            </Dialog.Close>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
            <ToastContainer />
        </div>
    );
}