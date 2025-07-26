import * as XLSX from 'xlsx';
export function ExcelCsvReader({getData}) {
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    if (!file) return;

    // Check file type
    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
    const isCsv = file.name.endsWith('.csv');

    reader.onload = (evt) => {
      let data;
      if (isExcel) {
        const arrayBuffer = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        data = XLSX.utils.sheet_to_json(worksheet);
      } else if (isCsv) {
        const text = evt.target.result;
        const workbook = XLSX.read(text, { type: 'string' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        data = XLSX.utils.sheet_to_json(worksheet);
      } else {
        alert('❌ Unsupported file type');
        return;
      }
      getData(data)
    };

    if (isExcel) {
      reader.readAsArrayBuffer(file); // for binary Excel
    } else if (isCsv) {
      reader.readAsText(file); // for plain CSV
    }
  };

  return (
    <div className="p-4 border rounded shadow w-100">
      <input
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFileUpload}
      />
      <p className="text-sm text-gray-500 mt-2">
        Upload Excel or CSV file to view data in console
      </p>
    </div>
  );
}


export function excelDateToJSDate(serial) {
  const excelEpoch = new Date(Date.UTC(1899, 11, 30)); // Excel's day 0 (with leap bug correction)
  const msPerDay = 24 * 60 * 60 * 1000;
  return new Date(excelEpoch.getTime() + serial * msPerDay);
}


export function DataTable({ data }) {
  if (!data || data.length === 0) {
    return <p className="text-gray-500">No data to display.</p>;
  }


  const headers = Object.keys(data[0]);

  return (
    <div className="overflow-x-auto border rounded shadow">
      <table className="min-w-full border border-collapse">
        <thead className="bg-gray-100 text-sm font-semibold">
          <tr>
            {headers.map((key) => (
              <th key={key} className="border px-4 py-2 text-left">{key}</th>
            ))}
          </tr>
        </thead>
        <tbody className="text-sm">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="odd:bg-white even:bg-gray-50">
              {headers.map((key) => (
                <td key={key} className="border px-4 py-2">
                  {row[key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}