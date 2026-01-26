package com.buildex.service;

import com.buildex.entity.Enquiry;
import com.buildex.repository.EnquiryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EnquiryService {

    private final EnquiryRepository enquiryRepository;
    private final EmailService emailService;

    public EnquiryService(EnquiryRepository enquiryRepository, EmailService emailService) {
        this.enquiryRepository = enquiryRepository;
        this.emailService = emailService;
    }

    public Enquiry createEnquiry(Enquiry enquiry) {
        Enquiry savedEnquiry = enquiryRepository.save(enquiry);

        // Send email to builder
        if (savedEnquiry.getProperty() != null && savedEnquiry.getProperty().getBuilder() != null) {
            com.buildex.entity.Builder builder = savedEnquiry.getProperty().getBuilder();
            emailService.sendEnquiryReceivedEmail(
                    builder.getEmail(),
                    builder.getCompanyName(),
                    savedEnquiry.getName(),
                    savedEnquiry.getEmail(),
                    savedEnquiry.getPhone(),
                    savedEnquiry.getProperty().getName(),
                    savedEnquiry.getMessage());
        }

        return savedEnquiry;
    }

    public List<Enquiry> getEnquiriesByPropertyId(Long propertyId) {
        return enquiryRepository.findByPropertyId(propertyId);
    }

    public List<Enquiry> getEnquiriesByBuilderId(Long builderId) {
        return enquiryRepository.findByBuilderId(builderId);
    }

    public Optional<Enquiry> getEnquiryById(Long id) {
        return enquiryRepository.findById(id);
    }

    public List<Enquiry> getAllEnquiries() {
        return enquiryRepository.findAll();
    }
}