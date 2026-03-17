import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface Props {
    value: string;
    onChange: (html: string) => void;
}

export default function RichTextEditor({ value, onChange }: Props) {
    const editor = useEditor({
        extensions: [StarterKit],
        content: value,
        onUpdate: ({ editor }) => onChange(editor.getHTML()),
    });

    if (!editor) return null;

    return (
        <div className="rte-wrapper">
            <div className="rte-toolbar">
                <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'rte-btn active' : 'rte-btn'} title="Bold">
                    <b>B</b>
                </button>
                <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'rte-btn active' : 'rte-btn'} title="Italic">
                    <i>I</i>
                </button>
                <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'rte-btn active' : 'rte-btn'} title="Strikethrough">
                    <s>S</s>
                </button>
                <div className="rte-divider" />
                <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'rte-btn active' : 'rte-btn'} title="Heading 2">
                    H2
                </button>
                <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? 'rte-btn active' : 'rte-btn'} title="Heading 3">
                    H3
                </button>
                <div className="rte-divider" />
                <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'rte-btn active' : 'rte-btn'} title="Bullet list">
                    ≡
                </button>
                <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'rte-btn active' : 'rte-btn'} title="Ordered list">
                    1.
                </button>
                <div className="rte-divider" />
                <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive('blockquote') ? 'rte-btn active' : 'rte-btn'} title="Blockquote">
                    "
                </button>
                <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} className="rte-btn" title="Horizontal rule">
                    —
                </button>
                <div className="rte-divider" />
                <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className="rte-btn" title="Undo">
                    ↩
                </button>
                <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className="rte-btn" title="Redo">
                    ↪
                </button>
            </div>
            <EditorContent editor={editor} className="rte-content" />
        </div>
    );
}
