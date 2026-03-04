import {auth} from '@clerk/nextjs/server'
import {NextResponse} from 'next/server'
import {prisma} from '@/lib/prisma'

export async function GET() {
    try {
        const {userId} = await auth()
        if (!userId) {
            return NextResponse.json({message: 'Unauthorized'}, {status: 401})
        }

        const conversations = await prisma.conversations.findMany({
            where: {userId},
            orderBy: {updatedAt: 'desc'},
            select: {
                id: true,
                title: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: {messages: true},
                },
            },
        })

        return NextResponse.json(conversations, {status: 200})
    } catch (error) {
        console.error('Failed to fetch conversations:', error)
        return NextResponse.json({message: 'Internal Server Error'}, {status: 500})
    }
}

export async function POST() {
    try {
        const {userId} = await auth()
        if (!userId) {
            return NextResponse.json({message: 'Unauthorized'}, {status: 401})
        }

        const conversation = await prisma.conversations.create({
            data: {
                userId,
                title: 'New Conversation',
            },
            select: {
                id: true,
                title: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: {messages: true},
                },
            },
        })

        return NextResponse.json(conversation, {status: 201})
    } catch (error) {
        console.error('[POST /api/conversations]', error)
        return NextResponse.json({message: 'Internal Server Error'}, {status: 500})
    }
}