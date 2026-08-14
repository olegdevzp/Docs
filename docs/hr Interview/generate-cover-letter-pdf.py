#!/usr/bin/env python3
"""Generate a professional cover letter PDF."""

from pathlib import Path

from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer


def build_pdf(output_path: Path) -> None:
    doc = SimpleDocTemplate(
        str(output_path),
        pagesize=A4,
        leftMargin=2.5 * cm,
        rightMargin=2.5 * cm,
        topMargin=2.5 * cm,
        bottomMargin=2.5 * cm,
        title="Cover Letter - Nortal Senior Front End Developer (Angular)",
        author="Oleh Pliuta",
    )

    styles = getSampleStyleSheet()
    name = ParagraphStyle(
        "Name",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=12,
        leading=15,
        spaceAfter=6,
    )
    role = ParagraphStyle(
        "Role",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=11,
        leading=14,
        spaceAfter=14,
    )
    body = ParagraphStyle(
        "Body",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=10.5,
        leading=15,
        alignment=TA_LEFT,
        spaceAfter=10,
    )
    section = ParagraphStyle(
        "Section",
        parent=body,
        fontName="Helvetica-Bold",
        spaceBefore=4,
        spaceAfter=8,
    )
    footer = ParagraphStyle(
        "Footer",
        parent=body,
        spaceBefore=12,
        textColor="#333333",
    )

    story = [
        Paragraph("Oleh Pliuta · Croatia", name),
        Paragraph("Senior Front End Developer (Angular) — Nortal", role),
        Paragraph(
            "Senior Angular/TypeScript developer — <b>10+ years</b>, <b>30+</b> web and mobile "
            "applications (fintech, healthcare, logistics, e-commerce/marketplace).",
            body,
        ),
        Paragraph("Role fit", section),
        Paragraph(
            "Built real-time monitoring interfaces for production use: WebSocket-driven logistics "
            "dashboards, WebRTC video in telemedicine, HLS video in an LMS — directly relevant to "
            "camera monitoring and remote video review in railway surveillance.",
            body,
        ),
        Paragraph(
            "Ship Angular apps at scale with standalone components, signals, RxJS, Nx monorepos, "
            "lazy loading, and shared UI libraries; comfortable working within established style "
            "guides (Televic UI / PrimeNG).",
            body,
        ),
        Paragraph(
            "Daily stack: REST + WebSockets, SASS, unit and E2E tests, Git, Docker, CI. "
            "Node.js/NestJS background; can support Python/FastAPI when needed.",
            body,
        ),
        Paragraph("Croatia · remote · business travel OK", footer),
    ]

    doc.build(story)


if __name__ == "__main__":
    out = Path(__file__).with_name("cover-letter.pdf")
    build_pdf(out)
    print(f"Created: {out}")
