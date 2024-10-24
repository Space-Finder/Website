import axios from "axios";
import { toast } from "react-toastify";
import { Dispatch, SetStateAction } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateBookingMutation(
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
