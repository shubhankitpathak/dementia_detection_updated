from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from io import BytesIO
from datetime import datetime
import uuid


def generate_assessment_pdf(assessment: dict, user: dict) -> BytesIO:
    """Generate a professional PDF report for an assessment."""
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, topMargin=0.5*inch, bottomMargin=0.5*inch)
    
    # Container for PDF elements
    elements = []
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#2563eb'),
        spaceAfter=20,
        alignment=TA_CENTER
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=16,
        textColor=colors.HexColor('#1e293b'),
        spaceAfter=12,
        spaceBefore=20
    )
    
    # Title
    elements.append(Paragraph("Cognitive Assessment Report", title_style))
    elements.append(Spacer(1, 0.3*inch))
    
    # Medical Disclaimer Box
    disclaimer_text = """
    <b>IMPORTANT MEDICAL DISCLAIMER:</b><br/>
    This assessment is a screening tool only and does NOT constitute a medical diagnosis. 
    Results should be discussed with a qualified healthcare professional. 
    Early detection and professional evaluation are essential for proper care.
    """
    disclaimer_style = ParagraphStyle(
        'Disclaimer',
        parent=styles['Normal'],
        fontSize=9,
        textColor=colors.HexColor('#64748b'),
        borderWidth=1,
        borderColor=colors.HexColor('#2563eb'),
        borderPadding=10,
        backColor=colors.HexColor('#eff6ff'),
        alignment=TA_LEFT
    )
    elements.append(Paragraph(disclaimer_text, disclaimer_style))
    elements.append(Spacer(1, 0.3*inch))
    
    # Patient Information
    elements.append(Paragraph("Patient Information", heading_style))
    
    patient_data = [
        ['Name:', user.get('name', 'N/A')],
        ['Email:', user.get('email', 'N/A')],
        ['Test Date:', datetime.fromisoformat(str(assessment['test_date'])).strftime('%B %d, %Y at %I:%M %p')],
        ['Assessment ID:', assessment['id'][:8] + '...'],
    ]
    
    patient_table = Table(patient_data, colWidths=[2*inch, 4*inch])
    patient_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 11),
        ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor('#64748b')),
        ('TEXTCOLOR', (1, 0), (1, -1), colors.HexColor('#1e293b')),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ]))
    elements.append(patient_table)
    elements.append(Spacer(1, 0.3*inch))
    
    # Overall Results
    elements.append(Paragraph("Overall Assessment Results", heading_style))
    
    overall_score = assessment['overall_score']
    risk_level = assessment['risk_level']
    risk_color = {
        'Low': colors.HexColor('#16a34a'),
        'Moderate': colors.HexColor('#f97316'),
        'High': colors.HexColor('#dc2626')
    }.get(risk_level, colors.black)
    
    overall_data = [
        ['Overall Cognitive Score:', f"{round(overall_score)}/100"],
        ['Risk Level:', risk_level],
    ]
    
    overall_table = Table(overall_data, colWidths=[3*inch, 3*inch])
    overall_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTNAME', (1, 0), (1, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 14),
        ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor('#64748b')),
        ('TEXTCOLOR', (1, 0), (1, 0), colors.HexColor('#2563eb')),
        ('TEXTCOLOR', (1, 1), (1, 1), risk_color),
        ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f8fafc')),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#e2e8f0')),
    ]))
    elements.append(overall_table)
    elements.append(Spacer(1, 0.3*inch))
    
    # Detailed Test Results
    elements.append(Paragraph("Detailed Test Results", heading_style))
    
    results = assessment['results']
    detailed_data = [['Test Domain', 'Score/Metric', 'Performance']]
    
    # Memory Test
    if results.get('memory_accuracy') is not None:
        memory_pct = round(results['memory_accuracy'])
        detailed_data.append([
            'Memory Recall',
            f"{memory_pct}%",
            f"{results.get('memory_correct', 0)}/{results.get('memory_total', 0)} correct"
        ])
    
    # Attention Test
    if results.get('attention_accuracy') is not None:
        attention_pct = round(results['attention_accuracy'])
        detailed_data.append([
            'Attention & Focus',
            f"{attention_pct}%",
            f"{results.get('attention_hits', 0)} hits, {results.get('attention_false_alarms', 0)} false alarms"
        ])
    
    # Reaction Test
    if results.get('reaction_avg_time') is not None:
        detailed_data.append([
            'Reaction Time',
            f"{round(results['reaction_avg_time'])}ms",
            f"Best: {round(results.get('reaction_best_time', 0))}ms"
        ])
    
    # Speech Test
    if results.get('speech_duration') is not None:
        detailed_data.append([
            'Speech Analysis',
            f"{results['speech_duration']}s",
            'Recording captured for analysis'
        ])
    
    detailed_table = Table(detailed_data, colWidths=[2*inch, 1.5*inch, 2.5*inch])
    detailed_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('FONTSIZE', (0, 1), (-1, -1), 11),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2563eb')),
        ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
        ('ALIGN', (1, 1), (1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e2e8f0')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8fafc')]),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
    ]))
    elements.append(detailed_table)
    elements.append(Spacer(1, 0.3*inch))
    
    # Recommendations
    elements.append(Paragraph("Clinical Recommendations", heading_style))
    
    if overall_score >= 75:
        rec_text = """
        Your cognitive performance is within normal ranges across all tested areas. 
        Continue maintaining a healthy lifestyle with regular mental and physical activities. 
        Consider scheduling regular assessments (every 6-12 months) to track your cognitive 
        health over time.
        """
    elif overall_score >= 50:
        rec_text = """
        Your results show some areas that could benefit from attention. We recommend 
        consulting with a healthcare professional for a comprehensive evaluation. 
        Engaging in cognitive exercises, maintaining social connections, and regular 
        physical activity can help support cognitive function. Consider lifestyle 
        modifications including adequate sleep, stress management, and a balanced diet.
        """
    else:
        rec_text = """
        We recommend consulting with a healthcare professional as soon as possible 
        for a thorough cognitive assessment. Early intervention and professional 
        guidance can make a significant difference in managing cognitive health concerns. 
        Please schedule an appointment with a neurologist or geriatrician for further 
        evaluation and personalized care recommendations.
        """
    
    rec_style = ParagraphStyle(
        'Recommendations',
        parent=styles['Normal'],
        fontSize=11,
        textColor=colors.HexColor('#1e293b'),
        alignment=TA_LEFT,
        leading=16
    )
    elements.append(Paragraph(rec_text, rec_style))
    elements.append(Spacer(1, 0.3*inch))
    
    # Footer
    footer_text = f"""
    <b>Report Generated:</b> {datetime.utcnow().strftime('%B %d, %Y at %I:%M %p UTC')}<br/>
    <b>Platform:</b> Cognitive Screening Platform - AI-Powered Early Dementia Detection<br/>
    <i>This report is confidential and intended for the named patient and their healthcare providers only.</i>
    """
    footer_style = ParagraphStyle(
        'Footer',
        parent=styles['Normal'],
        fontSize=8,
        textColor=colors.HexColor('#64748b'),
        alignment=TA_CENTER,
        borderPadding=10
    )
    elements.append(Spacer(1, 0.2*inch))
    elements.append(Paragraph(footer_text, footer_style))
    
    # Build PDF
    doc.build(elements)
    buffer.seek(0)
    return buffer


def generate_share_token() -> str:
    """Generate a unique share token."""
    return str(uuid.uuid4())
