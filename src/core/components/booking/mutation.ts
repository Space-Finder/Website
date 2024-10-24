import axios from "axios";
import { toast } from "react-toastify";
import { Dispatch, SetStateAction } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useBookingMutation(
    courseId: string,
    teacherId: string,
    week: number,
    setDialogOpen: Dispatch<SetStateAction<boolean>>,
) {
    const queryClient = useQueryClient();

    return useMutation({
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
                queryKey: ["bookings", courseId, week, teacherId],
            });
            setDialogOpen(false);
        },
        onError: (error: any) => {
            if (axios.isAxiosError(error) && error.response?.status === 409) {
                toast.error("Space is already booked for this period.");
            } else {
                toast.error("An error occurred while making the booking.");
            }
        },
    });
}

export function useEditBookingMutation(
    courseId: string,
    teacherId: string,
    week: number,
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (updatedBooking: {
            bookingId: string;
            spaceId: string;
            periodNumber: number;
            week: number;
        }) => {
            await axios.patch(`/api/bookings/`, updatedBooking);
        },
        onSuccess: () => {
            toast.success("Booking updated successfully!");
            queryClient.invalidateQueries({
                queryKey: ["bookings", courseId, week, teacherId],
            });
        },
        onError: () => {
            toast.error("An error occurred while updating the booking.");
        },
    });
}
