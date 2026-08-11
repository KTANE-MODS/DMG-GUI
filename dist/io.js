export async function saveTextFile(fileName, content) {
    try {
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        console.log('File saved successfully!');
    }
    catch (err) {
        console.error('Error writing file:', err);
    }
}
//# sourceMappingURL=io.js.map