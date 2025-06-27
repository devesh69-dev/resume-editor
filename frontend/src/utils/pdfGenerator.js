
// src/utils/pdfGenerator.js
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generatePDF = (resumeData) => {
  try {
    // Initialize jsPDF
    const doc = new jsPDF();

    // Set document properties
    doc.setProperties({
      title: `${resumeData.name}'s Resume`,
      subject: 'Professional Resume',
      author: resumeData.name
    });

    // Add header
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text(resumeData.name, 105, 20, { align: 'center' });

    // Add contact info
    doc.setFontSize(12);
    const contactInfo = [
      resumeData.email,
      resumeData.phone
    ].filter(Boolean).join(' | ');
    doc.text(contactInfo, 105, 28, { align: 'center' });

    // Add summary
    doc.setFontSize(14);
    doc.text('Summary', 14, 40);
    doc.setFontSize(11);
    const splitText = doc.splitTextToSize(resumeData.summary || '', 180);
    doc.text(splitText, 14, 48);

    // Add experience table
    doc.setFontSize(14);
    doc.text('Experience', 14, 70);
    
    autoTable(doc, {
      startY: 80,
      head: [['Position', 'Company', 'Period', 'Description']],
      body: resumeData.experience.map(exp => [
        exp.title || '',
        exp.company || '',
        exp.duration || '',
        exp.description || ''
      ]),
      headStyles: {
        fillColor: [44, 62, 80],
        textColor: 255
      }
    });

    // Add education table
    doc.setFontSize(14);
    doc.text('Education', 14, doc.lastAutoTable.finalY + 15);
    
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 25,
      head: [['Degree', 'Institution', 'Year']],
      body: resumeData.education.map(edu => [
        edu.degree || '',
        edu.university || '',
        edu.year || ''
      ])
    });

    // Add skills
    doc.setFontSize(14);
    doc.text('Skills', 14, doc.lastAutoTable.finalY + 15);
    doc.setFontSize(11);
    doc.text(resumeData.skills?.join(', ') || '', 14, doc.lastAutoTable.finalY + 22);

    // Save PDF
    doc.save(`${resumeData.name.replace(/\s+/g, '_')}_Resume.pdf`);
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  }
};