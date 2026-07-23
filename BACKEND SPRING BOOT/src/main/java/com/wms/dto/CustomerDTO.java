package com.wms.dto;

public class CustomerDTO {
    private String fullName;
    private String emailAddress;
    private String phoneCoordinates;
    private String location;
    private String tier;
    private Integer loyaltyPoints;

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmailAddress() { return emailAddress; }
    public void setEmailAddress(String emailAddress) { this.emailAddress = emailAddress; }
    public String getPhoneCoordinates() { return phoneCoordinates; }
    public void setPhoneCoordinates(String phoneCoordinates) { this.phoneCoordinates = phoneCoordinates; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getTier() { return tier; }
    public void setTier(String tier) { this.tier = tier; }
    public Integer getLoyaltyPoints() { return loyaltyPoints; }
    public void setLoyaltyPoints(Integer loyaltyPoints) { this.loyaltyPoints = loyaltyPoints; }
}