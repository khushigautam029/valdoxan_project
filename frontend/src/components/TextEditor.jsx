import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
    Bold,
    Heading2,
    Italic,
    List,
    ListOrdered,
    Quote,
} from "lucide-react";

const TextEditor = ({ value, onChange }) => {
    const editor = useEditor({
        extensions: [StarterKit],
        content: value || "",
        editorProps: {
            attributes: {
                // Focus styles applied directly to Tiptap's editable area
                class: "prose prose-slate max-w-none focus:outline-none min-h-[180px] p-4",
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    if (!editor) {
        return null;
    }

    return (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            {/* Toolbar */}
            <div className="flex items-center gap-1 border-b border-slate-200 bg-slate-50/50 px-3 py-2 text-slate-600">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-1.5 rounded hover:bg-slate-200/60 transition cursor-pointer ${
                        editor.isActive("bold")
                            ? "bg-slate-200 text-slate-900 font-bold"
                            : ""
                    }`}
                    title="Bold"
                >
                    <Bold size={16} />
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-1.5 rounded hover:bg-slate-200/60 transition cursor-pointer ${
                        editor.isActive("italic")
                            ? "bg-slate-200 text-slate-900"
                            : ""
                    }`}
                    title="Italic"
                >
                    <Italic size={16} />
                </button>

                <button
                    type="button"
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    className={`p-1.5 rounded hover:bg-slate-200/60 transition cursor-pointer ${
                        editor.isActive("heading", { level: 2 })
                            ? "bg-slate-200 text-slate-900"
                            : ""
                    }`}
                    title="Heading 2"
                >
                    <Heading2 size={16} />
                </button>

                <div className="h-4 w-[1px] bg-slate-300 mx-1" />

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-1.5 rounded hover:bg-slate-200/60 transition cursor-pointer ${
                        editor.isActive("bulletList")
                            ? "bg-slate-200 text-slate-900"
                            : ""
                    }`}
                    title="Bullet List"
                >
                    <List size={16} />
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-1.5 rounded hover:bg-slate-200/60 transition cursor-pointer ${
                        editor.isActive("orderedList")
                            ? "bg-slate-200 text-slate-900"
                            : ""
                    }`}
                    title="Numbered List"
                >
                    <ListOrdered size={16} />
                </button>

                <div className="h-4 w-[1px] bg-slate-300 mx-1" />

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`p-1.5 rounded hover:bg-slate-200/60 transition cursor-pointer ${
                        editor.isActive("blockquote")
                            ? "bg-slate-200 text-slate-900"
                            : ""
                    }`}
                    title="Blockquote"
                >
                    <Quote size={16} />
                </button>
            </div>

            {/* Editor Content Area */}
            <EditorContent editor={editor} />
        </div>
    );
};

export default TextEditor;