export function printResume() {
  const el = document.getElementById("resume-print-area");
  if (!el) return;

  // Inject print-only styles
  let printStyle = document.getElementById("resume-print-style") as HTMLStyleElement | null;
  if (!printStyle) {
    printStyle = document.createElement("style");
    printStyle.id = "resume-print-style";
    document.head.appendChild(printStyle);
  }
  printStyle.textContent = `
    @media print {
      @page { size: A4; margin: 0; }
      body * { visibility: hidden !important; }
      #resume-print-area,
      #resume-print-area * { visibility: visible !important; }
      #resume-print-area {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 210mm !important;
        height: 297mm !important;
        background: white !important;
        box-sizing: border-box !important;
        z-index: 99999 !important;
        overflow: hidden !important;
        border: none !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      #resume-print-area > * {
        min-height: 297mm !important;
      }
      * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    }

    #resume-print-spacer {
      display: none;
    }
    @media print {
      #resume-print-spacer {
        display: block !important;
        visibility: visible !important;
        height: 297mm !important;
        width: 210mm !important;
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        background: white !important;
        z-index: 99998 !important;
      }
    }
  `;

  // Add an invisible spacer div that guarantees full A4 behind the content
  let spacer = document.getElementById("resume-print-spacer");
  if (!spacer) {
    spacer = document.createElement("div");
    spacer.id = "resume-print-spacer";
    document.body.appendChild(spacer);
  }

  window.print();
}
