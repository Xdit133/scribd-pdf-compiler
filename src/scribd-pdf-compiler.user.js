// // ==UserScript==
// @name         Scribd Native PDF Compiler
// @namespace    https://github.com/Xdit133/scribd-pdf-compiler
// @version      13.0.0
// @description  Standalone PDF compilation engine with improved rendering to prevent blank pages.
// @match        https://www.scribd.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';
    const coreConsoleLogic = async function () {
        console.log("[System] Initializing PDF Compiler Engine...");

        const loadScript = (url) => new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });

        try {
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
            console.log("[System] Dependencies loaded successfully.");
        } catch (e) {
            alert("Error: Failed to load external libraries. Please check your network connection.");
            return;
        }

        const pages = document.querySelectorAll('.page, .outer_page, .new_page, [data-page-number], .document_page');
        const totalPages = pages.length;

        if (totalPages === 0) {
            alert("Error: No document pages detected. Please ensure the document is fully loaded.");
            return;
        }

        const overlay = document.createElement('div');
        overlay.id = 'sd-temp-overlay';
        overlay.style.cssText = "position:fixed;inset:0;background:rgba(15,15,15,0.95);z-index:999999;display:flex;flex-direction:column;justify-content:center;align-items:center;color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;";
        overlay.innerHTML = `
            <div style="background:#1e1e1e;padding:40px;border-radius:8px;text-align:center;width:450px;border:1px solid #333;box-shadow:0 10px 40px rgba(0,0,0,0.8);">
                <h2 style="color:#ffffff;margin-top:0;font-weight:600;letter-spacing:1px;">COMPILING PDF</h2>
                <p style="font-size:14px;color:#a0a0a0;line-height:1.6;">
                    Processing document layouts and geometry.<br>
                    <b style="color:#ef4444;">DO NOT SCROLL OR CHANGE TABS.</b>
                </p>
                <h4 id="sd-status" style="color:#e5e5e5;margin:25px 0 10px 0;font-weight:400;">Preparing engine...</h4>
                <div style="width:100%;height:8px;background:#333;border-radius:4px;overflow:hidden;">
                    <div id="sd-progress" style="width:0%;height:100%;background:#3b82f6;transition:width 0.4s ease;"></div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        const statusText = document.getElementById('sd-status');
        const progressBar = document.getElementById('sd-progress');

        try {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();

            for (let i = 0; i < totalPages; i++) {
                const page = pages[i];
                statusText.textContent = `Rendering page ${i + 1} of ${totalPages}...`;

                page.scrollIntoView({ behavior: 'instant', block: 'start' });
                page.style.visibility = 'visible';
                page.style.opacity = '1';

                await new Promise(r => setTimeout(r, 2000));

                const canvas = await html2canvas(page, {
                    scale: 2,
                    useCORS: true,
                    allowTaint: false,
                    backgroundColor: '#ffffff',
                    logging: false,
                    scrollY: -window.scrollY,
                    windowY: window.scrollY,
                    x: 0,
                    y: window.scrollY
                });

                const imgData = canvas.toDataURL('image/jpeg', 0.95);

                if (i > 0) pdf.addPage();

                const imgProps = pdf.getImageProperties(imgData);
                const ratio = imgProps.width / imgProps.height;
                const finalHeight = pdfWidth / ratio;

                pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, finalHeight);
                progressBar.style.width = `${Math.round(((i + 1) / totalPages) * 100)}%`;
            }

            statusText.textContent = 'Compilation complete. Initiating download...';
            await new Promise(r => setTimeout(r, 1000));

            pdf.save('Document_Export.pdf');
            overlay.remove();

        } catch (error) {
            console.error("[System Error]", error);
            overlay.innerHTML = `
                <div style="background:#1e1e1e;padding:40px;border-radius:8px;text-align:center;width:450px;border:1px solid #ef4444;">
                    <h2 style="color:#ef4444;margin-top:0;">PROCESS FAILED</h2>
                    <p style="color:#a0a0a0;font-size:13px;word-wrap:break-word;">${error.message}</p>
                    <button onclick="document.getElementById('sd-temp-overlay').remove()" style="background:#333;color:white;border:none;padding:10px 24px;margin-top:20px;border-radius:4px;cursor:pointer;">Dismiss</button>
                </div>
            `;
        }
    };

    function init() {
        const url = window.location.href;
        if (!url.includes('/document/') && !url.includes('/doc/') && !url.includes('/embeds/') && !url.includes('/read/')) return;

        if (document.getElementById('sd-auto-injector-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'sd-auto-injector-btn';

        btn.style.cssText = `
            position: fixed !important; bottom: 30px !important; right: 30px !important; z-index: 9999999 !important;
            background: #2563eb !important; color: #ffffff !important;
            border: 1px solid #1d4ed8 !important; padding: 14px 28px !important; border-radius: 6px !important;
            font-size: 14px !important; font-weight: 600 !important; cursor: pointer !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important; text-transform: uppercase !important;
            letter-spacing: 0.5px !important; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif !important;
            transition: background 0.2s ease !important;
        `;

        btn.onmouseover = () => { btn.style.background = '#1d4ed8'; };
        btn.onmouseout = () => { btn.style.background = '#2563eb'; };

        if (!url.includes('/embeds/')) {
            btn.textContent = 'AdBlock';
            btn.onclick = () => {
                const docId = url.match(/(?:document|doc|read)\/(\d+)/)[1];
                window.location.href = `https://www.scribd.com/embeds/${docId}/content`;
            };
        } else {
            btn.textContent = 'COMPILING PDF';
            btn.onclick = () => {
                const script = document.createElement('script');
                script.textContent = `(${coreConsoleLogic.toString()})();`;
                document.body.appendChild(script);
                script.remove();
            };
        }

        document.body.appendChild(btn);
    }

    setTimeout(init, 1500);
    setInterval(init, 3000);
})();
