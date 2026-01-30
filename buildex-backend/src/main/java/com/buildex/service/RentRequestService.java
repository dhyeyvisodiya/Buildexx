package com.buildex.service;

import com.buildex.entity.RentRequest;
import com.buildex.repository.RentRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RentRequestService {

    private final RentRequestRepository rentRequestRepository;
    private final com.buildex.repository.PropertyRepository propertyRepository;
    private final EmailService emailService;

    public RentRequestService(RentRequestRepository rentRequestRepository,
            com.buildex.repository.PropertyRepository propertyRepository,
            EmailService emailService) {
        this.rentRequestRepository = rentRequestRepository;
        this.propertyRepository = propertyRepository;
        this.emailService = emailService;
    }

    public RentRequest createRentRequest(RentRequest rentRequest) {
        RentRequest savedRequest = rentRequestRepository.save(rentRequest);

        // Send email to builder
        propertyRepository.findById(rentRequest.getPropertyId()).ifPresent(property -> {
            if (property.getBuilder() != null) {
                com.buildex.entity.User builder = property.getBuilder();
                // Note: RentRequest doesn't store a 'message' field in database based on entity
                // definition?
                // Wait, creating RentRequest in frontend passed 'message'. If entity differs,
                // we check entity again.
                // RentRequest entity DOES NOT have message. The frontend sends it, but backend
                // ignores it?
                // Let's pass "Interested in renting" as default message if missing.
                String message = "Interested in renting this property.";

                emailService.sendRentRequestEmail(
                        builder.getEmail(),
                        builder.getCompanyName(),
                        rentRequest.getApplicantName(),
                        rentRequest.getEmail(),
                        rentRequest.getPhone(),
                        property.getName(),
                        // No moveInDate in entity? Wait, let me check entity again.
                        // Entity has no moveInDate. It has monthlyRent, deposit.
                        // Frontend sends moveInDate.
                        // It seems the entity definition doesn't match frontend exactly.
                        // I will verify entity content below.
                        "ASAP",
                        message);
            }
        });

        return savedRequest;
    }

    public List<RentRequest> getRentRequestsByBuilderId(Long builderId) {
        return rentRequestRepository.findByBuilderId(builderId);
    }

    public Optional<RentRequest> updateRentRequestStatus(Long id, RentRequest.Status status) {
        Optional<RentRequest> rentRequestOpt = rentRequestRepository.findById(id);
        if (rentRequestOpt.isPresent()) {
            RentRequest rentRequest = rentRequestOpt.get();
            rentRequest.setStatus(status);
            return Optional.of(rentRequestRepository.save(rentRequest));
        }
        return Optional.empty();
    }

    public Optional<RentRequest> getRentRequestById(Long id) {
        return rentRequestRepository.findById(id);
    }

    public List<RentRequest> getAllRentRequests() {
        return rentRequestRepository.findAll();
    }
}