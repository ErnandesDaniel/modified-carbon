import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import type { CertificateDto } from "@/shared/api";
import { formatDateTime } from "@/shared/lib";

const escapeHtml = (value: string | null | undefined): string =>
  (value ?? "—").replace(/[&<>"']/g, (ch) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch] as string,
  );

const row = (label: string, value: string | null | undefined): string => `
  <div style="display:flex;padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:14px">
    <div style="width:230px;color:#666">${escapeHtml(label)}</div>
    <div style="font-weight:600">${escapeHtml(value)}</div>
  </div>`;

function buildHtml(cert: CertificateDto, qrDataUrl: string): string {
  return `
  <div style="border:1px solid #e9d8ff;border-radius:10px;overflow:hidden">
    <div style="height:8px;background:linear-gradient(90deg,#722ed1,#b37feb)"></div>
    <div style="padding:40px 48px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div>
          <div style="font-size:20px;font-weight:700">SCMS · Sleeving Clinic</div>
          <div style="color:#888;font-size:12px;margin-top:2px">Бей-Сити · сектор Протекторат · 2384</div>
        </div>
        <div style="text-align:right;color:#888;font-size:12px">
          Документ ${escapeHtml(cert.code)}<br/>Выдан ${escapeHtml(formatDateTime(cert.issuedAt))}
        </div>
      </div>

      <div style="text-align:center;font-size:24px;font-weight:700;margin:28px 0 6px">Сертификат совместимости</div>
      <div style="text-align:center;color:#888;font-size:13px;margin-bottom:28px">
        Настоящий документ подтверждает успешный перенос сознания и психосоматическую совместимость.
      </div>

      ${row("ID клиента", cert.methUserName)}
      ${row("Кейс needlecast", cert.caseCode)}
      ${row("Сертификат", cert.code)}
      ${row("Код проверки", cert.verificationCode)}
      ${row("Дата выдачи", formatDateTime(cert.issuedAt))}

      <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:36px">
        <div style="border-top:1px solid #d9d9d9;padding-top:6px;width:260px;color:#888;font-size:12px">
          Psychosurgeon · подпись
        </div>
        <div style="text-align:center">
          <img src="${qrDataUrl}" width="130" height="130" alt="QR" style="border:1px solid #f0f0f0;border-radius:8px"/>
          <div style="color:#888;font-size:11px;margin-top:6px">Проверка подлинности</div>
        </div>
      </div>
    </div>
  </div>`;
}

export async function downloadCertificatePdf(cert: CertificateDto): Promise<void> {
  const qrDataUrl = await QRCode.toDataURL(cert.verificationCode || cert.code, {
    margin: 1,
    width: 260,
    color: { dark: "#1f1f1f", light: "#ffffff" },
  });

  const node = document.createElement("div");
  Object.assign(node.style, {
    position: "fixed",
    left: "-10000px",
    top: "0",
    width: "794px",
    padding: "40px",
    background: "#ffffff",
    color: "#1f1f1f",
    fontFamily: "-apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
    boxSizing: "border-box",
  });
  node.innerHTML = buildHtml(cert, qrDataUrl);
  document.body.appendChild(node);

  try {
    const canvas = await html2canvas(node, { scale: 2, backgroundColor: "#ffffff" });
    const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const imgW = pageW;
    const imgH = (canvas.height * imgW) / canvas.width;
    pdf.addImage(canvas.toDataURL("image/jpeg", 0.92), "JPEG", 0, Math.min(0, (pageH - imgH) / 2), imgW, imgH);
    pdf.save(`${cert.code}.pdf`);
  } finally {
    document.body.removeChild(node);
  }
}
