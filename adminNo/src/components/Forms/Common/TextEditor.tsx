import React, { useRef } from 'react';
import JoditEditor from 'jodit-react';

interface TextEditorProps {
  onChange?: (content: string) => void;
  blogHtml: string;
  setBlogHtml: (content: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({
  onChange,
  blogHtml,
  setBlogHtml,
}) => {
  const editor = useRef<any>(null);

  const config = {
    readonly: false,
    height: 400,
    placeholder: 'Start typing privacy policy...',
    uploader: {
      insertImageAsBase64URI: true,
    },

    allowImages: true,
  };

  return (
    <JoditEditor
      ref={editor}
      value={blogHtml}
      config={config}
      onBlur={(newContent: string) => {
        setBlogHtml(newContent);
        if (onChange) onChange(newContent);
      }}
      onChange={() => {}}
    />
  );
};

export default TextEditor;
