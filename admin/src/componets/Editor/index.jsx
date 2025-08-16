import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import './styles.css'; // File CSS chúng ta sẽ tạo ở bước tiếp theo

// Component thanh công cụ cho trình soạn thảo
const MenuBar = ({ editor }) => {
    if (!editor) {
        return null;
    }

    // Hàm để thêm class 'is-active' khi một định dạng được kích hoạt
    const getButtonClass = (format) => {
        return editor.isActive(format) ? 'is-active' : '';
    };

    return (
        <div className="editor-menu">
            <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={getButtonClass('bold')}>Bold</button>
            <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={getButtonClass('italic')}>Italic</button>
            <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={getButtonClass('strike')}>Strike</button>
            <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={getButtonClass('heading', { level: 2 })}>H2</button>
            <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={getButtonClass('heading', { level: 3 })}>H3</button>
            <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={getButtonClass('bulletList')}>Bullet List</button>
            <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={getButtonClass('orderedList')}>Ordered List</button>
        </div>
    );
};

// Component Editor chính
const Editor = ({ value, onChange }) => {
    const editor = useEditor({
        extensions: [
            StarterKit, // Gói tiện ích cơ bản (bold, italic, headings, lists...)
        ],
        // Đảm bảo `content` luôn là một chuỗi để tránh lỗi
        content: value || '',
        // Hàm này được gọi mỗi khi nội dung trong trình soạn thảo thay đổi
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        // Các thuộc tính cho vùng soạn thảo
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-5 focus:outline-none',
            },
        },
    });

    return (
        <div className="tiptap-editor">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
};

export default Editor;