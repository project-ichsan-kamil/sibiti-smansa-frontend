import React, { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { BASE_URL } from '../../config/ApiConstants';

const MyEditor = () => {
    const editorRef = useRef(null);
    const [displayContent, setDisplayContent] = useState(''); // State untuk menyimpan konten yang ditampilkan
    const [imageUrl, setImageUrl] = useState(''); // State untuk menyimpan URL gambar yang ditampilkan

    const handleOkClick = () => {
        if (editorRef.current) {
            const content = editorRef.current.getContent();
            setDisplayContent(content); // Simpan konten ke state
        }
    };

    const uploadImage = (blobInfo, success, failure) => {
        const formData = new FormData();
        formData.append('file', blobInfo.blob(), blobInfo.filename());

        fetch(`${BASE_URL.development}/upload/tinymce`, {
            method: 'POST',
            body: formData,
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            setImageUrl(data.url); // Simpan URL gambar yang diupload
            if (editorRef.current) {
                editorRef.current.setContent(`<p>This is the initial content of the editor.</p>
                                               <img src="${data.url}" alt="Uploaded Image" style="max-width: 100%;" />`); // Hanya menampilkan gambar yang diupload
            }
            success(data.url); // URL gambar yang diupload
        })
        .catch(() => {
            failure('Image upload failed');
        });
    };

    return (
        <>
            <Editor
                tinymceScriptSrc="/tinymce/tinymce.min.js"
                onInit={(evt, editor) => editorRef.current = editor}
                initialValue="<p>This is the initial content of the editor.</p>"
                init={{
                    height: 500,
                    menubar: false,
                    plugins: [
                        'advlist autolink lists link image charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help wordcount'
                    ],
                    toolbar: 'undo redo | formatselect | ' +
                             'bold italic backcolor | alignleft aligncenter ' +
                             'alignright alignjustify | bullist numlist outdent indent | ' +
                             'removeformat | help',
                    images_upload_url: `${BASE_URL.development}/upload/tinymce`, // URL untuk upload gambar
                    images_upload_handler: uploadImage, // Fungsi upload gambar
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
            />
            <button onClick={handleOkClick}>OK</button>
            {displayContent && (
                <div style={{ marginTop: '20px', border: '1px solid #ddd', padding: '10px', backgroundColor: '#f9f9f9' }}>
                    <h3>Konten Editor:</h3>
                    <div dangerouslySetInnerHTML={{ __html: displayContent }} /> {/* Render konten editor */}
                </div>
            )}
        </>
    );
};

export default MyEditor;

