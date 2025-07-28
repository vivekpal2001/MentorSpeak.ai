import { agents, meetings } from "@/db/schema";
import { db } from "@/db";
import { eq, count } from "drizzle-orm";
import {
    createTRPCRouter,
    protectedProcedure,
} from "@/trpc/init";
import { polarClient } from "@/lib/polar";


export const premiumRouter = createTRPCRouter({
    getCurrentSubscription: protectedProcedure.query(async ({ ctx }) => {
        const customer = await polarClient.customers.getStateExternal({
            externalId: ctx.auth.user.id,
        });

        const subscription = customer.activeSubscriptions[0];

        if(!subscription){
            return null;
        }

        const product = await polarClient.products.get({
            id: subscription.productId,
        });

        return product;
    }),

    getProducts: protectedProcedure.query(async () => {
        const products = await polarClient.products.list({
            isArchived: false,
            isRecurring: true,
            sorting: ["price_amount"],
        })

        return products.result.items;
    }),

    getFreeUsage: protectedProcedure.query(async ({ ctx }) => {
        const customer = await polarClient.customers.getStateExternal({
            externalId: ctx.auth.user.id,
        });

        const subscription = customer.activeSubscriptions[0];

        if(subscription){
            return null;
        }

        const [userMeetings] = await db
            .select({
                count: count(meetings.id),
            })
            .from(meetings)
            .where(eq(meetings.userId, ctx.auth.user.id));


        const [userAgents] = await db
            .select({
                count: count(agents.id),
            })
            .from(agents)
            .where(eq(agents.userId, ctx.auth.user.id));

        return {
            meetingCount: userMeetings.count,
            agentCount: userAgents.count,
        };
    })
});