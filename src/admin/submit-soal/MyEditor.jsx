// // import React, { useRef, useState } from 'react';
// // import { Editor } from '@tinymce/tinymce-react';
// // import { BASE_URL } from '../../config/ApiConstants';
// // import { message } from 'antd';

// // const MyEditor = () => {
// //     const editorRef = useRef(null);
// //     const [displayContent, setDisplayContent] = useState(''); // State untuk menyimpan konten yang ditampilkan

// //     const handleOkClick = () => {
// //         if (editorRef.current) {
// //             const content = editorRef.current.getContent();
// //             setDisplayContent(content); // Simpan konten ke state
// //         }
// //     };

// //     const uploadImage = (blobInfo, success, failure) => {
// //         // Buat objek FormData dan tambahkan file blob
// //         const formData = new FormData();
// //         formData.append('file', blobInfo.blob(), blobInfo.filename());

// //         // Mengirim permintaan POST ke server untuk mengunggah file
// //         fetch(`${BASE_URL.development}/upload/tinymce`, {
// //             method: 'POST',
// //             body: formData,
// //         })
// //         .then(response => {
// //             if (!response.ok) {
// //                 throw new Error('Network response was not ok');
// //             }
// //             return response.json();
// //         })
// //         .then(data => {
// //             // Pastikan respons berisi URL gambar
// //             if (data.location) {
// //                 // Hapus gambar blob yang baru saja dimasukkan ke dalam editor
// //                 const editor = editorRef.current;
// //                 const imgElements = editor.dom.select('img');

// //                 imgElements.forEach(img => {
// //                     if (img.src.startsWith('blob:')) {
// //                         editor.dom.remove(img); // Hapus gambar blob dari editor
// //                     }
// //                 });

// //                 // Sisipkan gambar dengan URL yang diterima dari server
// //                 editor.insertContent(`<img src="${data.location}" alt="Uploaded Image" />`);

// //                 message.info(data.location)
// //                 success(data.location); // Beri tahu TinyMCE bahwa upload berhasil
// //             } else {
// //                 failure('Gagal mengunggah gambar: URL tidak ditemukan.');
// //             }
// //         })
// //         .catch(error => {
// //             console.error('Error uploading image:', error);
// //             failure('Gagal mengunggah gambar.');
// //         });
// //     };

// //     return (
// //         <>
// //             <Editor
// //                 tinymceScriptSrc="/tinymce/tinymce.min.js"
// //                 onInit={(evt, editor) => (editorRef.current = editor)}
// //                 initialValue="<p>This is the initial content of the editor.</p>"
// //                 init={{
// //                     height: 300,
// //                     menubar: false,
// //                     plugins: [
// //                         'advlist autolink lists link image charmap print preview anchor',
// //                         'searchreplace visualblocks code fullscreen',
// //                         'insertdatetime media table paste code help'
// //                     ],
// //                     toolbar: 'undo redo | formatselect | ' +
// //                              'bold italic | alignleft aligncenter ' +
// //                              'alignright alignjustify | bullist numlist outdent indent',
// //                     images_upload_handler: uploadImage, // Gunakan handler kustom untuk upload gambar
// //                     paste_data_images: true, // Izinkan penempelan gambar langsung
// //                     content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:12px }'
// //                 }}
// //             />
// //             <button onClick={handleOkClick}>OK</button>
// //             {displayContent && (
// //                 <div style={{ marginTop: '20px', border: '1px solid #ddd', padding: '10px', backgroundColor: '#f9f9f9' }}>
// //                     <h3>Konten Editor:</h3>
// //                     <div dangerouslySetInnerHTML={{ __html: displayContent }} /> {/* Render konten editor */}
// //                 </div>
// //             )}
// //         </>
// //     );
// // };

// // export default MyEditor;

import React, { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { BASE_URL } from "../../config/ApiConstants";
import { message } from "antd";

const MyEditor = ({ initialData, onSave, heightEditor, editorId }) => {
    const editorRef = useRef(null);
    const [displayContent, setDisplayContent] = useState(initialData || "");

    const handleOkClick = () => {
        if (editorRef.current) {
            const content = editorRef.current.getContent();
            setDisplayContent(content);
            if (onSave) onSave(content);
        }
    };

    const uploadImage = (blobInfo, success, failure) => {
        const formData = new FormData();
        formData.append("file", blobInfo.blob(), blobInfo.filename());

        fetch(`${BASE_URL.development}/upload/tinymce`, {
            method: "POST",
            body: formData,
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                if (data.location) {
                    // Hapus gambar blob yang baru saja dimasukkan ke dalam editor
                    const editor = editorRef.current;
                    const imgElements = editor.dom.select("img");

                    imgElements.forEach((img) => {
                        if (img.src.startsWith("blob:")) {
                            editor.dom.remove(img); // Hapus gambar blob dari editor
                        }
                    });

                    // Sisipkan gambar dengan URL yang diterima dari server
                    editor.insertContent(
                        `<img src="${data.location}" alt="Uploaded Image" />`
                    );

                    success(data.location); // Beri tahu TinyMCE bahwa upload berhasil
                } else {
                    failure("Gagal mengunggah gambar: URL tidak ditemukan.");
                }
            })
            .catch((error) => {
                message.error("Error uploading image:", error);
                failure("Gagal mengunggah gambar.");
            });
    };

    return (
        <>
            <Editor
                id={editorId}
                
                tinymceScriptSrc="/tinymce/tinymce.min.js"
                onInit={(evt, editor) => (editorRef.current = editor)}
                initialValue={displayContent}
                init={{
                    license_key: 'gpl',
                    height: heightEditor,
                    menubar: false,
                    plugins: [ "image" ],
                    toolbar:
                        "undo redo | formatselect | " +
                        "bold italic | alignleft aligncenter " +
                        "alignright alignjustify | bullist numlist outdent indent",
                    images_upload_handler: uploadImage,
                    paste_data_images: true,
                    content_style:
                        "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                }}
            />
        </>
    );
};

export default MyEditor;


