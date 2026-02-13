package com.buildex.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BuilderSummaryDTO {
    private Long id;
    private String username;
    private String email;

    @JsonProperty("full_name")
    private String fullName;

    private String phone;

    @JsonProperty("company_name")
    private String companyName;

    @JsonProperty("verification_status")
    private String verificationStatus;

    @JsonProperty("property_count")
    private Long propertyCount;

    // Constructor matching the JPQL query signature
    public BuilderSummaryDTO(Long id, String username, String email, String fullName, String phone, String companyName, Enum<?> verificationStatus, Long propertyCount) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.fullName = fullName;
        this.phone = phone;
        this.companyName = companyName;
        this.verificationStatus = verificationStatus != null ? verificationStatus.name() : null;
        this.propertyCount = propertyCount;
    }
}
