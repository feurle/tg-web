import { useEditor, EditorContent } from '@tiptap/react'
import Bold from '@tiptap/extension-bold'
import Document from '@tiptap/extension-document'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'

interface Props {
    value: string;
    onChange: (html: string) => void;
}

export default function RichTextEditor({ value, onChange }: Props) {
    const editor = useEditor({
        extensions: [Document, Paragraph, Text, HorizontalRule, Bold],
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
                <div className="rte-divider" />
                <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} className="rte-btn" title="Horizontal rule">
                    —
                </button>
                <div className="rte-divider" />
            </div>
            <EditorContent editor={editor} className="rte-content" />
        </div>
    );
}
