"use client"

import { Button } from "@/components/ui/button"
import { PlusIcon, XCircleIcon } from "lucide-react"

import { DEFAULT_PAGE } from "@/constant"
import { NewMeetingDialog } from "./new-meeting-dialog"
import { useState } from "react"

export  const MeetingsListHeader = () => {
    // const [filters, setFilters] = userAgentsFilters();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    // const isAnyFilterModified = !!filters.search;
    
    // const onClerFilters = () => {
    //     setFilters({
    //         search: "",
    //         page: DEFAULT_PAGE,
    //     });
    // }
    return (
        <> 
            <NewMeetingDialog 
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
            />
            <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4 ">
                <div className="flex items-center justify-between">
                    <h5 className="font-medium text-xl">My Meetings</h5>
                    <Button onClick={()=>setIsDialogOpen(true)}>
                        <PlusIcon/>
                        New Meeting
                    </Button>
                </div>
                <div className="flex items-center gap-x-2 p-1">
                        <Button variant="outline" size="sm" onClick={()=>{}} >
                            <XCircleIcon/>
                            Clear
                        </Button>
                    
                </div>
            </div>
        </>
    )
}