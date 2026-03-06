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
      @page {
        size: A4;
        margin: 0;
      }

      html, body {
        margin: 0 !important;
        padding: 0 !important;
        width: 210mm !important;
      }

      /* Hide everything except the print container */
      body > *:not(#resume-print-container) {
        display: none !important;
      }

      nav, footer, header, button, [role="dialog"], .fixed {
        display: none !important;
      }

      #resume-print-container {
        display: block !important;
        visibility: visible !important;
        position: static !important;
        width: 210mm !important;
        max-width: 210mm !important;
        height: auto !important;
        overflow: visible !important;
        background: white !important;
        border: none !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        margin: 0 !important;
        z-index: 99999 !important;
      }

      #resume-print-container,
      #resume-print-container * {
        visibility: visible !important;
        overflow: visible !important;
      }

      /* Ensure template fills at least one full A4 page */
      #resume-print-container > * {
        min-height: 297mm !important;
      }

      /* Preserve colors and backgrounds */
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    }
  `;

  // Clone the entire resume element (preserving its classes and internal padding)
  let printContainer = document.getElementById("resume-print-container");
  if (printContainer) printContainer.remove();

  const clone = el.cloneNode(true) as HTMLElement;
  clone.id = "resume-print-container";
  // Only override the outer preview styling, keep internal template padding intact
  clone.style.border = "none";
  clone.style.borderRadius = "0";
  clone.style.boxShadow = "none";
  clone.style.margin = "0";
  clone.style.maxWidth = "none";
  clone.style.width = "100%";

  document.body.appendChild(clone);

  window.print();

  // Clean up after print
  clone.remove();
}
