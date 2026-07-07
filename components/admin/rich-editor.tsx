"use client"

import { useState, useCallback, type ReactNode } from "react"
import { useEditor, EditorContent, type Content } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import ImageExtension from "@tiptap/extension-image"
import LinkExtension from "@tiptap/extension-link"
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link,
  Image,
  Eye,
  Edit3,
  Quote,
  Undo,
  Redo,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface RichEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  maxLength?: number
  label?: string
  error?: string
  helperText?: string
  className?: string
  minHeight?: string
}

interface ToolbarButtonProps {
  onClick: () => void
  isActive?: boolean
  children: ReactNode
  title: string
}

function ToolbarButton({ onClick, isActive, children, title }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        "p-1.5 rounded-md transition-all text-sm",
        isActive
          ? "bg-secondary text-dark-slate shadow-sm"
          : "text-text-muted hover:text-text-primary hover:bg-bg-secondary",
      )}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <div className="w-px h-5 bg-border mx-0.5" />
}

export function RichEditor({
  value,
  onChange,
  placeholder = "Start writing...",
  maxLength,
  label,
  error,
  helperText,
  className,
  minHeight = "300px",
}: RichEditorProps) {
  const [preview, setPreview] = useState(false)
  const [charCount, setCharCount] = useState(value.length)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      ImageExtension.configure({
        inline: false,
        allowBase64: true,
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-secondary underline underline-offset-2 hover:text-secondary-light",
        },
      }),
    ],
    content: value as Content,
    onUpdate: ({ editor: ed }) => {
      const html = ed.getHTML()
      onChange(html)
      setCharCount(ed.storage.characterCount?.characters?.() || html.length)
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[200px] px-4 py-3",
      },
    },
  })

  const addLink = useCallback(() => {
    if (!editor) return
    const previousUrl = editor.getAttributes("link").href
    const url = window.prompt("Enter URL:", previousUrl || "https://")
    if (url === null) return
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }
    if (url) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
    }
  }, [editor])

  const addImage = useCallback(() => {
    if (!editor) return
    const url = window.prompt("Enter image URL:", "https://")
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  if (!editor) {
    return (
      <div className={cn("flex flex-col gap-1.5", className)}>
        {label && (
          <label className="text-sm font-medium text-text-primary">{label}</label>
        )}
        <div
          className="rounded-xl border border-border bg-warm-white dark:bg-bg-secondary shimmer-skeleton"
          style={{ minHeight }}
        />
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-text-primary">{label}</label>
          {maxLength && (
            <span className="text-xs text-text-muted">
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      )}

      <div
        className={cn(
          "rounded-xl border overflow-hidden transition-all",
          error
            ? "border-red-500 focus-within:ring-2 focus-within:ring-red-500/20"
            : "border-border focus-within:ring-2 focus-within:ring-secondary/20 focus-within:border-secondary",
          "bg-warm-white dark:bg-bg-secondary",
        )}
      >
        <div className="flex items-center gap-0.5 p-2 border-b border-border bg-bg-secondary/30 flex-wrap">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </ToolbarButton>
          <Divider />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive("heading", { level: 1 })}
            title="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive("heading", { level: 2 })}
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive("heading", { level: 3 })}
            title="Heading 3"
          >
            <Heading3 className="h-4 w-4" />
          </ToolbarButton>
          <Divider />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
            title="Ordered List"
          >
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive("blockquote")}
            title="Quote"
          >
            <Quote className="h-4 w-4" />
          </ToolbarButton>
          <Divider />
          <ToolbarButton onClick={addLink} isActive={editor.isActive("link")} title="Link">
            <Link className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={addImage} title="Image">
            <Image className="h-4 w-4" />
          </ToolbarButton>
          <Divider />
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            title="Undo"
          >
            <Undo className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            title="Redo"
          >
            <Redo className="h-4 w-4" />
          </ToolbarButton>
          <div className="flex-1" />
          <button
            type="button"
            onClick={() => setPreview(!preview)}
            className={cn(
              "p-1.5 rounded-md transition-all text-sm",
              preview
                ? "bg-secondary text-dark-slate shadow-sm"
                : "text-text-muted hover:text-text-primary hover:bg-bg-secondary",
            )}
            title={preview ? "Edit" : "Preview"}
          >
            {preview ? <Edit3 className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {preview ? (
          <div
            className="prose prose-sm max-w-none p-4 min-h-[200px] text-text-primary"
            style={{ minHeight }}
            dangerouslySetInnerHTML={{ __html: value }}
          />
        ) : (
          <EditorContent
            editor={editor}
            className="[&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[200px]"
            style={{ minHeight }}
          />
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="text-xs text-text-muted">{helperText}</p>
      )}
    </div>
  )
}
