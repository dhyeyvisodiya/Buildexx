package com.buildex.service;

import com.buildex.entity.Payment;
import com.buildex.entity.Property;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URL;
import java.time.format.DateTimeFormatter;

@Service
public class PdfService {

    public byte[] generatePaymentReceipt(Payment payment) {
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Header
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Paragraph header = new Paragraph("Buildex Realty - Payment Receipt", headerFont);
            header.setAlignment(Element.ALIGN_CENTER);
            document.add(header);
            document.add(Chunk.NEWLINE);

            // Payment Details Section
            PdfPTable paymentTable = new PdfPTable(2);
            paymentTable.setWidthPercentage(100);
            paymentTable.setSpacingBefore(10f);
            paymentTable.setSpacingAfter(10f);

            addTableRow(paymentTable, "Payment ID", String.valueOf(payment.getId()));
            addTableRow(paymentTable, "Transaction ID", payment.getRazorpayPaymentId()); // or transactionId
            addTableRow(paymentTable, "Date", payment.getPaymentDate() != null ? 
                        payment.getPaymentDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")) : "N/A");
            addTableRow(paymentTable, "Amount Paid", payment.getCurrency() + " " + payment.getAmount());
            addTableRow(paymentTable, "Payment Type", payment.getPaymentType().toString());
            addTableRow(paymentTable, "For Month", payment.getRentMonth() != null ? payment.getRentMonth() : "N/A");
            
            document.add(new Paragraph("Payment Details", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14)));
            document.add(paymentTable);
            document.add(Chunk.NEWLINE);

            // Property Details Section
            Property property = payment.getProperty();
            document.add(new Paragraph("Property Details", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14)));
            
            PdfPTable propertyTable = new PdfPTable(2);
            propertyTable.setWidthPercentage(100);
            
            addTableRow(propertyTable, "Property Title", property.getTitle());
            addTableRow(propertyTable, "Location", property.getArea() + ", " + property.getCity());
            addTableRow(propertyTable, "Type", property.getPropertyType().toString());
            addTableRow(propertyTable, "Builder", property.getBuilderName());
            
            document.add(propertyTable);
            document.add(Chunk.NEWLINE);

            // Images
            if (property.getImageUrl() != null && !property.getImageUrl().isEmpty()) {
                try {
                    Image img = Image.getInstance(new URL(property.getImageUrl()));
                    img.scaleToFit(500, 300);
                    img.setAlignment(Element.ALIGN_CENTER);
                    document.add(img);
                } catch (Exception e) {
                    // Ignore image formatting errors
                }
            }
            
            // Footer
            document.add(Chunk.NEWLINE);
            Paragraph footer = new Paragraph("This is a system generated receipt.", FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 10));
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            document.close();
        } catch (DocumentException e) {
            throw new RuntimeException("Error generating PDF", e);
        }

        return out.toByteArray();
    }

    private void addTableRow(PdfPTable table, String header, String value) {
        PdfPCell headerCell = new PdfPCell(new Phrase(header, FontFactory.getFont(FontFactory.HELVETICA_BOLD)));
        headerCell.setBackgroundColor(java.awt.Color.LIGHT_GRAY);
        headerCell.setPadding(5);
        table.addCell(headerCell);

        PdfPCell valueCell = new PdfPCell(new Phrase(value));
        valueCell.setPadding(5);
        table.addCell(valueCell);
    }
}
