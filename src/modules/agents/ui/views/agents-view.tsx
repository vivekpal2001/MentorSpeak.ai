"use client"

import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { useTRPC } from "@/trpc/client"
import { LoadingState } from "@/components/loading-state"
import { ErrorState } from "@/components/error-state";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { DataTable } from "../components/data-table";
import { columns} from "../components/columns";
import { EmptyState } from "@/components/empty-state";



export const AgentsView = () => {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions());

    return (
        <div className="flex-1 pb-4 md:px-8 flex flex-col gap-y-4">
            <DataTable data={data} columns={columns}/>
            {data.length === 0 && (
                <EmptyState
                    title="Create your first agent"
                    description="Create an agent to join your meetings. Each agent will foloow your instruction and can interact with participants during the call"
                />
            )}
        </div>
    );
};

export const AgentsViewLoading = () => {
    return (
        <LoadingState
            title="Loading Agents"
            description= "This may take a few secons"
        />
    )
}
export const AgentsViewError = () => {
    return (
        <ErrorState
            title="Error Loading Agents"
            description= "Something went wrong"
        />
    )
}