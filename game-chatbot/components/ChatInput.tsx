"use client";

import { useEffect, useRef, useState } from "react";
import { useChatStore } from "@/lib/store/chatStore";
import { cn } from "@/lib/utils";
import { Mic, SendHorizontal, Upload, X } from "lucide-react";
import axios from "@/lib/axios";
import { isAxiosError } from "axios";
import { toast } from "sonner";

interface UploadedFile {
  file: File;
  preview?: string;
}

export default function ChatInput() {
  const {
    currentConversation,
    addMessage,
    isSending,
    setIsSending,
    setIsLoading,
  } = useChatStore();

  const [message, setMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  }, [message]);

  const canSend = !isSending && !!message.trim() && !!currentConversation;

  const handleSend = async () => {
    if (
      (!message.trim() && uploadedFiles.length === 0) ||
      !currentConversation ||
      isSending
    )
      return;

    const userMessage = message.trim();
    setMessage("");
    setUploadedFiles([]);
    setIsSending(true);
    setIsLoading(true);

    addMessage({
      id: `${crypto.randomUUID()}-${Date.now().toString()}`,
      role: "user",
      content: userMessage,
      conversationId: currentConversation,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    try {
      const { data } = await axios.post("/chat", {
        conversationId: currentConversation,
        message: userMessage,
      });

      addMessage({
        id: data.id,
        role: "assistant",
        content: data.content,
        conversationId: currentConversation,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      });
    } catch (error) {
      if (isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || "An error occurred";

        if (status === 401) {
          toast.error("Unauthorized");
        } else if (status === 429) {
          toast.error("Too many requests, please try again later");
        } else {
          toast.error(message);
        }
      }
    } finally {
      setIsSending(false);
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    const newFiles: UploadedFile[] = Array.from(files).map((file) => ({
      file,
      preview: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : undefined,
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);
    e.target.value = "";
  };

  const removeFile = (indexToRemove: number) => {
    setUploadedFiles((prev) => {
      const file = prev[indexToRemove];
      if (file.preview) URL.revokeObjectURL(file.preview);
      return prev.filter((_, index) => index !== indexToRemove);
    });
  };

  return (
    <div className="w-full px-4 pb-4 pt-2">
      <div className="max-w-3xl mx-auto">
        <div
          className={cn(
            "rounded-3xl border bg-background/90 p-2 shadow-sm backdrop-blur transition-all duration-200",
            "focus-within:border-zinc-400 focus-within:shadow-md dark:focus-within:border-zinc-500",
            "border-zinc-200 dark:border-zinc-800",
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />

          {uploadedFiles.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2 px-1 pt-1">
              {uploadedFiles.map((uploadedFile, index) => (
                <span
                  key={`${uploadedFile.file.name}-${index}`}
                  className="inline-flex max-w-full items-center gap-2 rounded-full border border-zinc-300 bg-zinc-100 px-1.5 py-1 text-xs text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                >
                  {/* File Previews */}
                  {uploadedFile.preview && (
                    <img
                      src={uploadedFile.preview}
                      alt={uploadedFile.file.name}
                      className="h-7 w-7 shrink-0 rounded-md border border-zinc-300 object-cover dark:border-zinc-600"
                      loading="lazy"
                    />
                  )}
                  <span className="truncate max-w-[180px]">
                    {uploadedFile.file.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    aria-label={`Remove ${uploadedFile.file.name}`}
                    className="rounded-full p-0.5 transition-colors hover:bg-zinc-300/70 dark:hover:bg-zinc-700/80"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleUploadClick}
              aria-label="Upload file"
              className="inline-flex h-9 w-9 shrink-0 self-center items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-zinc-200/60 hover:text-foreground dark:hover:bg-zinc-700/60"
            >
              <Upload className="h-4 w-4" />
            </button>

            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={"Message your assistant..."}
              disabled={isSending}
              rows={1}
              className={cn(
                "w-full resize-none bg-transparent pb-2 pt-2",
                "text-sm leading-relaxed placeholder:text-muted-foreground",
                "focus:outline-none disabled:opacity-50",
                "min-h-[44px] max-h-[200px]",
              )}
            />

            <button
              type="button"
              aria-label="Speech to text"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-zinc-200/60 hover:text-foreground dark:hover:bg-zinc-700/60"
            >
              <Mic className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={handleSend}
              disabled={!canSend}
              aria-label="Send message"
              className={cn(
                "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all",
                canSend
                  ? "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
                  : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600",
              )}
            >
              <SendHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
