"use client";

import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { BookingDialog } from "./dialog";

import { formatTime } from "@lib/times";
import { useCreateBookingMutation } from "./mutation";
import { getBookings, getAvailableSpaces } from "./api";
import { Period as FullPeriod } from "@core/types/timetable";
import { Course, Teacher, Space, Booking as DBBooking } from "@prisma/client";

type Period = Extract<FullPeriod, { periodType: "CLASS" }>;
type Booking = DBBooking & { space: Space; course: Course };

// TODO: implement this
const findTime = (line: number, period: number) => {
    return null;
};

export default function BookingData({
    week,
    course,
    teacher,
}: {
    week: number;
    course: Course;
    teacher: Teacher;
}) {
    const router = useRouter();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [availableSpaces, setAvailableSpaces] = useState<Space[]>([]);
    const [selectedSpace, setSelectedSpace] = useState<string | null>(null);
    const [selectedTodo, setSelectedTodo] = useState<Period | null>(null);
    const [showAlert, setShowAlert] = useState(false);

    const { data, isLoading, error } = useQuery({
        queryKey: ["bookings", course.id, week, teacher.id],
        queryFn: async () => await getBookings(course.id, teacher.id, week),
    });

    const bookingMutation = useCreateBookingMutation(
        course.id,
        teacher.id,
        week,
        setIsDialogOpen,
    );

    useEffect(() => {
        if (course.teacherId !== teacher.id) {
            router.push(`/dashboard/book?teacher=${teacher.code}`);
        }
    }, [teacher]);

    const handleBookingAttempt = () => {
        const alreadyBookedSpace = data?.bookingsMade.find(
            (b: Booking) => b && b.spaceId === selectedSpace,
        );

        if (alreadyBookedSpace) {
            return setShowAlert(true);
        }

        handleMakeBooking();
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

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error fetching data.</div>;

    const {
        periodsBooked,
        periodsToBook,
        bookingsMade,
    }: {
        periodsBooked: Period[];
        periodsToBook: Period[];
        bookingsMade: Booking[];
    } = data;

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

            <BookingDialog
                isDialogOpen={isDialogOpen}
                setIsDialogOpen={setIsDialogOpen}
                availableSpaces={availableSpaces}
                selectedSpace={selectedSpace}
                setSelectedSpace={setSelectedSpace}
                handleBookingAttempt={handleBookingAttempt}
                showAlert={showAlert}
                setShowAlert={setShowAlert}
            />
        </div>
    );
}
