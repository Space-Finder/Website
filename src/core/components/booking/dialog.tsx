import { Dispatch, SetStateAction } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

import { Space } from "@prisma/client";

interface BookingDialogProps {
    isDialogOpen: boolean;
    setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
    availableSpaces: Space[];
    selectedSpace: string | null;
    setSelectedSpace: Dispatch<SetStateAction<string | null>>;
    handleBookingAttempt: () => void;
    showAlert: boolean;
    setShowAlert: Dispatch<SetStateAction<boolean>>;
}

export function BookingDialog({
    isDialogOpen,
    setIsDialogOpen,
    availableSpaces,
    selectedSpace,
    setSelectedSpace,
    handleBookingAttempt,
    showAlert,
    setShowAlert,
}: BookingDialogProps) {
    return (
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
                                onOpenChange={() => {
                                    setShowAlert(false);
                                }}
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
                                            You have already booked this space
                                            for another period. Are you sure you
                                            want to proceed?
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
                                                        handleBookingAttempt
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
    );
}
