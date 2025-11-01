// components/QuillEditorPro.tsx
import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

export interface QuillEditorProProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: string;       // e.g. "400px"
  className?: string;
}

/** minimal type to satisfy TS for toolbar.addHandler */
type ToolbarModule = {
  addHandler: (format: string, handler: (value?: any) => void) => void;
};

const QuillEditorPro: React.FC<QuillEditorProProps> = ({
  value,
  onChange,
  placeholder = 'Start writing…',
  height = '450px',
  className = '',
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (!editorRef.current || quillRef.current) return;

    quillRef.current = new Quill(editorRef.current, {
      theme: 'snow',
      placeholder,
      modules: {
        toolbar: [
          // headings only (keep; no font or size chooser)
          [{ header: [1, 2, 3, 4, 5, 6, false] }],

          // styling
          ['bold', 'italic', 'underline', 'strike'],
          [{ color: [] }, { background: [] }],
          [{ script: 'sub' }, { script: 'super' }],

          // lists
          [{ list: 'ordered' }, { list: 'bullet' }],

          // links only (no files/images/videos)
          ['link'],

          // blocks (no code-block)
          ['blockquote'],

          // clean
          ['clean'],
        ],
        history: {
          delay: 1500,
          maxStack: 500,
          userOnly: true,
        },
        clipboard: {
          matchVisual: false,
        },
      },
      // IMPORTANT: disallow formats we hid (prevents pasted embeds, code, etc.)
      formats: [
        'bold', 'italic', 'underline', 'strike',
        'color', 'background', 'script',
        'link',
        'header', 'blockquote',
        'list', 'bullet',
        // intentionally omitted:
        // 'font', 'size', 'align', 'indent', 'direction',
        // 'code', 'code-block', 'image', 'video'
      ],
    });

    const quill = quillRef.current;

    // initial value
    if (value) {
      quill.clipboard.dangerouslyPasteHTML(value);
    }

    // onChange
    quill.on('text-change', (_delta, _old, source) => {
      if (source === 'user') {
        const html = quill.root.innerHTML || '';
        onChange(html === '<p><br></p>' ? '' : html);
      }
    });

    // Keyboard shortcuts
    quill.keyboard.addBinding({ key: 'B', shortKey: true }, () => {
      const range = quill.getSelection();
      if (!range) return false;
      const cur = quill.getFormat(range);
      quill.format('bold', !cur.bold);
      return false;
    });

    quill.keyboard.addBinding({ key: 'I', shortKey: true }, () => {
      const range = quill.getSelection();
      if (!range) return false;
      const cur = quill.getFormat(range);
      quill.format('italic', !cur.italic);
      return false;
    });

    quill.keyboard.addBinding({ key: 'U', shortKey: true }, () => {
      const range = quill.getSelection();
      if (!range) return false;
      const cur = quill.getFormat(range);
      quill.format('underline', !cur.underline);
      return false;
    });

    // “Save” shortcut stub (Ctrl/Cmd+S)
    quill.keyboard.addBinding({ key: 'S', shortKey: true }, () => {
      console.log('Save triggered (Ctrl/Cmd+S)');
      return false;
    });

    // Custom toolbar handlers (keep only link; remove image/video handlers)
    const toolbar = quill.getModule('toolbar') as unknown as ToolbarModule;

    toolbar.addHandler('link', (value?: any) => {
      if (value) {
        const href = window.prompt('Enter the URL:');
        if (href) quill.format('link', href);
      } else {
        quill.format('link', false);
      }
    });

    return () => {
      quill.off('text-change', () => {});
    };
  }, [placeholder, value]);

  // external value sync (when props.value changes programmatically)
  useEffect(() => {
    const quill = quillRef.current;
    if (!quill) return;
    const current = quill.root.innerHTML;
    if (value !== current && document.activeElement !== quill.root) {
      const sel = quill.getSelection();
      quill.clipboard.dangerouslyPasteHTML(value || '');
      if (sel) quill.setSelection(sel);
    }
  }, [value]);

  return (
    <div className={className}>
      {/* wrapper with a nicer look using Tailwind */}
      <div className="rounded-lg border shadow-sm">
        <div className="ql-toolbar ql-snow rounded-t-lg border-b" />
        <div
          ref={editorRef}
          className="ql-container ql-snow rounded-b-lg"
          style={{ minHeight: height }}
        />
      </div>

      {/* extra polishing for editor content via global CSS classes */}
      <style>{`
        .ql-container {
          border: 0;
          font-family: inherit;
        }
        .ql-toolbar {
          border: 0;
        }
        .ql-editor {
          min-height: ${height};
          font-size: 0.95rem;
          line-height: 1.6;
          padding: 1rem 1.25rem;
        }
        .ql-editor:focus { outline: none; }
        .ql-editor img {
          max-width: 100%;
          height: auto;
          border-radius: 0.375rem;
          margin: 0.5rem 0;
        }
        .ql-editor pre.ql-syntax {
          background: #0b1020;
          color: #e6edf3;
          border-radius: 0.375rem;
          padding: 0.75rem 1rem;
          overflow-x: auto;
        }
        .ql-editor blockquote {
          border-left: 4px solid #e5e7eb;
          color: #334155;
          margin: 0.75rem 0;
          padding-left: 0.75rem;
        }
      `}</style>
    </div>
  );
};

export default QuillEditorPro;
