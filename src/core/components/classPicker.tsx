import { Course } from "@prisma/client";
import * as Select from "@radix-ui/react-select";
import {
    CheckIcon,
    ChevronDownIcon,
    ChevronUpIcon,
} from "@radix-ui/react-icons";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import React from "react";

const CoursePicker = ({
    course,
    courses,
}: {
    course: Course | null;
    courses: Course[];
}) => {
    const pathname = usePathname();
    const router = useRouter();
    const currentSearchParams = useSearchParams();

    return (
        <Select.Root
            value={course?.id}
            onValueChange={(courseId) => {
                const updatedSearchParams = new URLSearchParams(
                    currentSearchParams.toString(),
                );
                updatedSearchParams.set("courseId", courseId);

                router.push(pathname + "?" + updatedSearchParams.toString());
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
                            {courses.map((course) => (
                                <Select.Item
                                    key={course.id}
                                    value={course.id}
                                    className="flex cursor-pointer items-center justify-between p-2 hover:bg-gray-100"
                                >
                                    <Select.ItemText>
                                        {course.name} ({course.code})
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
    );
};

export default CoursePicker;
