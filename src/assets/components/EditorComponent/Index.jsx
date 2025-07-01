import { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import Paragraph from "@editorjs/paragraph";
import EditorjsList from "@editorjs/list";
import ImageTool from "@editorjs/image";
import axios from "axios";

const DEFAULT_INITIAL_DATA =  {
      "time": new Date().getTime(),
      "blocks": [
        {
          "type": "header",
          "data": {
            "text": "Masukkan isi halaman >>>",
            "level": 1
          }
        },
      ]
  }

const EditorComponent = (props) => {
  const {id, setFormData, value, placeholder = 'Mulai tuliskan isi postingan >>>'} = props;
  const ejInstance = useRef();

    const initEditor = () => {
       const editor = new EditorJS({
          holder: id,
          onReady: async () => {
            ejInstance.current = editor;
          },
          minHeight: 0,
          autofocus: true,
          data: value,
          placeholder: placeholder,
          onChange: async () => {
            let content = await editor.saver.save();
            setFormData(prev => ({ ...prev, [id]:content }));

          },
          defaultBlock: 'paragraph',
          tools: { 
            header: {
              class: Header,
              toolbox: {
                title: 'Judul'
              },
            }, 
            paragraph: {
              class: Paragraph,
              toolbox: {
                title: 'Teks'
              }
            },
            list: {
              class: EditorjsList,
              inlineToolbar: true,
              config: {
                defaultStyle: 'unordered',
              },
            },
            image: {
              class: ImageTool,
              // inlineToolbar: true,
              toolbox: {
                title: 'Gambar'
              },
              config: {
                uploader: {
                  async uploadByFile(files) {
                    const formData = new FormData();
                    formData.append('image', files);
                    const response = await axios.post('http://localhost:3000/v1/image/create', formData,
                      {
                        headers: {
                          "Content-Type":"multipart/form-data",
                        },
                        withCredentials: false,
                      }
                    );
                    if(response.data.success === 1) {
                      console.log(response.data)
                      return {success: 1, file: {url: `http://localhost:3000/${response.data.file.url}`}};
                    }
                  }
                },
                
              }
            }
          },
          i18n: {
            messages: {
              toolNames: {
                "Ordered List": "Daftar Urut",
                "Unordered List": "Daftar Tidak Berurut",
                "Text": "Teks",
                "Heading": "Judul",
                // "Heading 1": "Judul",
                "List": "Daftar",
                "Convert to": "Ubah menjadi"
              },
              blockTunes: {
                "delete": {
                  "Delete": "Hapus"
                },
                "moveUp": {
                  "Move up": "Naikkan"
                },
                "moveDown": {
                  "Move down": "Turunkan"
                },
                "convertTo": {
                  "Convert to": "Ubah menjadi"
                }
                
              },
              tools: {
                EditorjsList: {
                  'Unordered': 'Tidak Berurut',
                  'Ordered': 'Berurut',
                  // 'Checklist': 'Centang',
                },
                "convertTo": {'The block can not be displayed correctly.': 'Блок не может быть отображен'}
              },
              ui: {
                "blockTunes": {
                  "toggler": {
                    "Click to tune": "Klik untuk mengatur",
                    "or drag to move": "atau geser untuk pindahkan"
                  },
                },
                "inlineToolbar": {
                  "convertTo": {
                  "Convert to": "Ubah menjadi"
                },
                  "Convert to": "Конвертировать в"
                },
                "toolbar": {
                  "toolbox": {
                    "Add": "Tambahkan"
                  }
                }
              },
            },
          },
        });
        console.log(editor.blocks)
      };

      // This will run only once
  useEffect(() => {
    if (ejInstance.current === null) {
      initEditor();
    }

    return () => {
      ejInstance?.current?.destroy();
      ejInstance.current = null;
    };
  }, []);

    return(
      <>
        <div id={id} className="editor-container bg-white px-3 py-3 border-2 rounded-md flex flex-col w-full min-h-80 overflow-y-scroll"></div>
      </>
    )  
}


export default EditorComponent;