
export  function DragDropUpload() {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);
      // 👉 You can now upload this `file` to server or preview it
      console.log('Dropped file:', file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  return (
    <div
      className={`flex flex-col items-center justify-center w-[300px] h-[200px] 
        border-2 border-dotted rounded-2xl transition-colors
        ${dragActive ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-400'}
      `}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <p className="text-gray-600 mb-2">
        {fileName ? `Uploaded: ${fileName}` : 'Drag & Drop your file here'}
      </p>
      <input
        type="file"
        id="fileUpload"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            setFileName(file.name)
    uploadFileToIndexedDB(file).then((msg) => console.log(msg)).catch((err) => alert("Upload failed!"));
          }
        }}
        className="hidden"
      />
      <label
        htmlFor="fileUpload"
        className="cursor-pointer px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Or Choose File
      </label>
    </div>
  );
}


export async function uploadFileToIndexedDB(file) {
  if (!file) throw new Error("No file provided");

  try {
    const db = await openDB('FileStorageDB', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('files')) {
          db.createObjectStore('files');
        }
      },
    });

    await db.put('files', file, 'uploadedFile');
    return `✅ File '${file.name}' saved to IndexedDB`;
  } catch (err) {
    console.error("❌ IndexedDB upload failed:", err);
    throw err;
  }
}
