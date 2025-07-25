import Link from "next/link";
import Markdown from "react-markdown";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { MeetingGetOne } from "../../types";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpenTextIcon, ClockFadingIcon, FileTextIcon, FileVideoIcon, Heading1, SparkleIcon, Video } from "lucide-react";
import { format } from "date-fns/format";
import { Badge } from "@/components/ui/badge";
import { formatDuration } from "@/lib/utils";


interface Props{
    data : MeetingGetOne;
}

// Function to remove timestamps from markdown content
const removeTimestamps = (markdownContent: string): string => {
    if (!markdownContent) return '';
    
    // Remove timestamp patterns like: *Timestamp 6340-10340:*
    return markdownContent.replace(/\*Timestamp \d+-\d+:\*\s*/g, '');
};

export const CompletedState = ({ data }: Props) => {
    return (
        <div className="flex flex-col gap-y-4">
            <Tabs defaultValue="summary">
                <div className="bg-white rounded-lg border px-3">
                    <ScrollArea>
                        <TabsList className="p-0 bg-background justify-start rounded-none h-13">
                            <TabsTrigger 
                                value="summary"
                                className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground"
                            >
                                <BookOpenTextIcon />
                                Summary
                            </TabsTrigger>
                            <TabsTrigger 
                                value="transcript"
                                className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground"
                            >
                                <FileTextIcon />
                                Transcript
                            </TabsTrigger>
                            <TabsTrigger 
                                value="recording"
                                className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground"
                            >
                                <FileVideoIcon />
                                Recording
                            </TabsTrigger>
                            <TabsTrigger 
                                value="chat"
                                className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground"
                            >
                                <SparkleIcon />
                                Ask AI
                            </TabsTrigger>
                        </TabsList>
                        <ScrollBar orientation="horizontal" />

                    </ScrollArea>
                </div>
                <TabsContent value="recording">
                    <div className="bg-white rounded-lg border px-4 py-4">
                        <video 
                            src={data.recordingUrl!}
                            className="w-full rounded-lg"
                            controls
                        />
                    </div>
                </TabsContent>
                <TabsContent value="summary">
                    <div className="bg-white rounded-lg border ">
                        <div className="px-4 py-5 gap-y-5 flex flex-col col-span-5">
                            <h2 className="text-2xl font-medium capitalize">{data.name}</h2>
                            <div className="flex gap-x-2 items-center">
                                <Link
                                    href={`/agents/${data.agent.id}`}
                                    className="flex items-center gap-x-2 underline underline-offset-4 capitalize"
                                >
                                    <GeneratedAvatar
                                        variant="botttsNeutral"
                                        seed={data.agent.name}
                                        className="size-5"
                                    />
                                    {data.agent.name}
                                </Link>{" "}
                                <p>{data.startedAt ? format(data.startedAt, "PPP") : ""}</p>
                            </div>
                            <div className="flex gap-x-2 items-center">
                                <SparkleIcon className="size-4"/>
                                <p>General summary</p>
                            </div>
                            <Badge
                                variant="outline"
                                className="flex items-center gap-x-2 [&>svg]:size-4"
                            >
                                <ClockFadingIcon className="text-blue-700"/>
                                {data.duration ? formatDuration(data.duration) : "No duration"}
                            </Badge>
                            <div>
                                <Markdown
                                    components={{
                                        h1: (props) => (
                                            <h1 className="text-2xl font-medium mb-6" {...props}></h1>
                                        ),
                                        h2: (props) => (
                                            <h2 className="text-xl font-medium mb-6" {...props}></h2>
                                        ),
                                        h3: (props) => (
                                            <h3 className="text-lg font-medium mb-6" {...props}></h3>
                                        ),
                                        h4: (props) => (
                                            <h4 className="text-base font-medium mb-6" {...props} />
                                        ),
                                        p: (props) => (
                                            <p className="leading-relaxed mb-6" {...props} />
                                        ),
                                        ul: (props) => (
                                            <ul className="list-disc list-inside mb-6" {...props} />
                                        ),
                                        ol: (props) => (
                                            <ol className="list-decimal list-inside mb-6" {...props} />
                                        ),
                                        li: (props) => (
                                            <li className=" mb-1" {...props} />
                                        ),
                                        strong: (props) => (
                                            <strong className=" mb-1" {...props} />
                                        ),
                                        code: (props) => (
                                            <code className=" mb-1" {...props} />
                                        ),
                                        blockquote: (props) => (
                                            <blockquote className=" mb-1" {...props} />
                                        ),
                                    }}
                                >
                                    {removeTimestamps(data.summary)}
                                </Markdown>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}