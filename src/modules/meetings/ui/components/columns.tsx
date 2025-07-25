"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { MeetingGetMany } from "../../types"
import { GeneratedAvatar } from "@/components/generated-avatar"
import { cn, formatDuration } from "@/lib/utils"
import {
    CircleCheckIcon,
    CircleXIcon,
    ClockArrowUpIcon,
    ClockFadingIcon,
    CornerDownRightIcon,
    Loader,
    LoaderIcon,
    VideoIcon
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.



const statusIconMap = {
    upcoming: ClockArrowUpIcon,
    active: LoaderIcon,
    completed: CircleCheckIcon,
    processing: LoaderIcon,
    cancelled: CircleXIcon
};
const statusColorMap = {
    upcoming: "bg-yellow-500/20 text-yellow-800 border-yellow-800/5",
    active: "bg-blue-500/20 text-blue-800 border-blue-800/5",
    completed: "bg-emerald-500/20 text-emerald-800 border-emerald-800/5",
    processing: "bg-gray-300/20 text-rose-800 border-rose-800/5",
    cancelled: "bg-rose-500/20 text-rose-800 border-rose-800/5"
};

export const columns: ColumnDef<MeetingGetMany[number]>[] = [
  {
    accessorKey: "name",
    header: "Agent Name",
    cell: ({ row }) => (
        <div className="flex flex-col gap-y-1">
            <span className="font-semibold capitalize">{row.original.name}</span>
            <div className="flex items-center gap-x-2">
                <div className="flex items-center gap-x-1">
                    <CornerDownRightIcon className="size-3 text-muted-foreground "/>
                    <span className="text-sm text-muted-foreground max-w-[200px] truncate capitalize">
                        {row.original.agent.name}
                    </span>
                </div>
                <GeneratedAvatar
                    variant="botttsNeutral"
                    seed={row.original.agent.name}
                    className="size-4"
                />
                <span className="text-sm text-muted-foreground">
                    {row.original.startedAt ? format(row.original.startedAt, "MMM d"): ""}
                </span>
            </div>
            


        </div>
    )
  },
  {
    accessorKey: "meetingCount",
    header: "Meetings",
    cell: ({row}) => {
        const Icon = statusIconMap[row.original.status as keyof typeof statusIconMap];
        return (
            <Badge
                variant="outline"
                className={cn(
                    "capitalize [&>svg]:size-4 text-muted-foreground",
                    statusColorMap[row.original.status as keyof typeof statusColorMap]
                )}
            >
                <Icon 
                    className={cn(
                        row.original.status === "processing" && "animate-spin"
                    )}
                />
                {row.original.status}
            </Badge>
        )
    }
  },
  {
    accessorKey: "duration",
    header: "duration",
    cell: ({ row }) => (
        <Badge
            variant="outline"
            className="capitalize [&>svg]:size-4 flex items-center gap-x-2"
        >
            <ClockFadingIcon className="text-blue-700" />
            {row.original.duration ? formatDuration(row.original.duration): "No duration"}
        </Badge>
    ),
  },
];