import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import { prisma } from '@/lib/db'
import { SYSTEM_PROMPT, buildTitlePrompt } from '@/lib/prompts/system'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })
const MODEL = 'gemini-2.5-flash'

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const { conversationId, message } = body

        if (!conversationId || !message?.trim()) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
        }

        const conversation = await prisma.conversations.findFirst({
            where: { id: conversationId, userId },
        })

        if (!conversation) {
            return NextResponse.json({ message: 'Conversation not found' }, { status: 404 })
        }

        const history = await prisma.message.findMany({
            where: { conversationId },
            orderBy: { createdAt: 'asc' },
            take: 20,
            select: { role: true, content: true },
        })

        await prisma.message.create({
            data: {
                conversationId,
                role: 'user',
                content: message.trim(),
            },
        })

        const chatHistory = history.map((msg) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
        }))

        // Gọi Gemini
        const chat = ai.chats.create({
            model: MODEL,
            config: { systemInstruction: SYSTEM_PROMPT },
            history: chatHistory,
        })

        const response = await chat.sendMessage({ message: message.trim() })
        const aiResponse = response.text ?? ''

        // Lưu AI response
        const savedMessage = await prisma.message.create({
            data: {
                conversationId,
                role: 'assistant',
                content: aiResponse,
            },
        })

        // Tự động tạo title nếu là tin nhắn đầu tiên
        if (history.length === 0) {
            const titleResponse = await ai.models.generateContent({
                model: MODEL,
                contents: buildTitlePrompt(message.trim()),
            })
            const title = titleResponse.text?.trim() || 'New Conversation'

            await prisma.conversations.update({
                where: { id: conversationId },
                data: { title, updatedAt: new Date() },
            })
        } else {
            await prisma.conversations.update({
                where: { id: conversationId },
                data: { updatedAt: new Date() },
            })
        }

        return NextResponse.json(savedMessage)
    } catch (error) {
        console.error('[POST /api/chat]', error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}
