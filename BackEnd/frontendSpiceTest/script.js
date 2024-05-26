
async function downloadVVFile() {
    const vmId = 101; // This can be dynamic based on user input or selection

    // Define the endpoint URL for the SPICE proxy
    const url = `http://localhost:3000/vm/spiceproxy`;

    // Prepare the request body with the vmId
    const data = {
        vmId: vmId
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch SPICE proxy data: ${response.status} ${response.statusText}`);
        }

        const responseData = await response.json();
        console.log("Backend response:", responseData); // Log the backend response


        // Assuming responseData contains fields like host, port, ticket, etc.
        const { ca, host, password, title, type } = responseData.data;
        const tlsport = responseData.data['tls-port']
        const deleteThisFile = responseData.data['delete-this-file']
        const hostSubject = responseData.data['host-subject']
        console.log(hostSubject)
        //const releaseCursor = response.data['release-cursor']
        //const secureAttention = response.data['secure-attention']
        //const toggleFullScreen = response.data['toggle-fullscreen']
        const proxy  = 'http://localhost:3128'
    
    




        const vvContent = [
            `[virt-viewer]`,
            `tls-port=${tlsport}`,
            `host=${host}`,
            `title=${title}`,
            `host-subject=${hostSubject}`,
            `ca=${ca}`,
            `secure-attention=Ctrl+Alt+Ins`,
            `toggle-fullscreen=Shift+F11`,
            `delete-this-file=${deleteThisFile}`,
            `release-cursor=Ctrl+Alt+R`,
            `proxy=${proxy}`,
            `type=${type}`,
            `password=${password}`,
        ].join('\n');

        console.log("Formatted .vv content:", vvContent); // Log the formatted .vv content

        const blob = new Blob([vvContent], { type: 'text/plain' });

        // Download the blob as a .vv file
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `vm-${vmId}.vv`; // Set the download filename
        document.body.appendChild(link);
        link.click(); // Trigger the download
        link.remove(); // Clean up after download
        window.URL.revokeObjectURL(downloadUrl); // Free up storage used by the blob

    } catch (error) {
        console.error("Error downloading the .vv file:", error);
    }
}