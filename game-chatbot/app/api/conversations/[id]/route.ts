import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params

        const conversation = await prisma.conversations.findFirst({
            where: { id, userId },
        })

        if (!conversation) {
            return NextResponse.json({ message: 'Not Found' }, { status: 404 })
        }

        const messages = await prisma.message.findMany({
            where: { conversationId: id },
            orderBy: { createdAt: 'asc' },
            include: { attachments: true },
        })

        return NextResponse.json(messages)
    } catch (error) {
        console.error('[GET /api/conversations/:id]', error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}

export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params

        const conversation = await prisma.conversations.findFirst({
            where: { id, userId },
        })

        if (!conversation) {
            return NextResponse.json({ message: 'Not Found' }, { status: 404 })
        }

        await prisma.conversations.delete({ where: { id } })

        return NextResponse.json({ message: 'Deleted successfully' })
    } catch (error) {
        console.error('[DELETE /api/conversations/:id]', error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}
